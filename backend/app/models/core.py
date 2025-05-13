from elasticsearch import Elasticsearch
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.models import Article
from app.models.base import Base, engine, Session
from datetime import datetime
import app.services.articles as article_service
import pandas as pd
import time


def create_tables():
    Base.metadata.create_all(engine)
    news_df = pd.read_csv('./rss_feeder/naked_science.csv')

    def create_news(row):
        pub_date = (
            datetime.strptime(row['pub_date'], "%a, %d %b %Y %H:%M:%S %z")
            .date()
            .strftime('%d.%m.%Y')
        )
        article = Article(
            title=row['title'],
            type='news',
            category=row['category'],
            publication_date=pub_date,
            annotation=row['plain_text'][:1000],
            authors=[row['author']],
            magazine='Naked Science',
            link=row['link'],
            keywords=[],
        )
        article_service.create_article(Session=Session, article=article)

    start = time.time()
    news_df.apply(create_news, axis=1)
    print(time.time() - start)


def fast_create_tables(es: Elasticsearch):
    Base.metadata.create_all(engine)
    news_df = pd.read_csv('./rss_feeder/nc_keywords_test.csv')

    def create_news(row):
        pub_date = (
            datetime.strptime(row['pub_date'], "%a, %d %b %Y %H:%M:%S %z")
            .date()
            .strftime('%d.%m.%Y')
        )
        article = Article(
            title=row['title'],
            type='news',
            category=row['category'],
            publication_date=pub_date,
            annotation=row['plain_text'][:1000],
            authors=[row['author']],
            magazine='Naked Science',
            link=row['link'],
            keywords=row['keywords'].split(';'),
        )
        article_service.create_article(
            Session=Session, es=es, article=article, gen_keywords=False
        )

    start = time.time()
    news_df.apply(create_news, axis=1)
    print(time.time() - start)
    print(article_service.search_articles(es=es, search_phrase='эксперименты'))


def save_keywords():
    news_df = pd.read_csv('./rss_feeder/naked_science.csv')
    start = time.time()
    with Session() as session:
        articles = (
            session.execute(
                select(Article)
                .join(Article.keywords)
                .group_by(Article.id)
                .order_by(Article.title)
                .options(selectinload(Article.keywords), selectinload(Article.authors))
            )
            .scalars()
            .all()
        )
    keywords = [
        ';'.join([keyword.keyword for keyword in article.keywords])
        for article in articles
    ]
    print(keywords)
    news_df = news_df.sort_values(by='title')

    news_df['keywords'] = pd.Series(data=keywords)
    news_df = news_df.sort_values(by='pub_date')

    news_df.to_csv('./rss_feeder/nc_keywords_test.csv', index=False)
    print(time.time() - start)


def drop_tables():
    Base.metadata.drop_all(engine)


if __name__ == '__main__':
    create_tables()
