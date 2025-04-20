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
            content=row['plain_text'],
            authors=[row['author']],
            magazine='Naked Science',
            link=row['link'],
            keywords=[],
        )
        article_service.create_article(Session=Session, article=article)

    start = time.time()
    news_df.apply(create_news, axis=1)
    print(time.time() - start)


def drop_tables():
    Base.metadata.drop_all(engine)


if __name__ == '__main__':
    create_tables()
