from sqlalchemy import select
from app.models.models import Article, Author
from app.models.base import Base, engine, Session
from datetime import datetime
import pandas as pd


def create_tables():
    Base.metadata.create_all(engine)
    news_df = pd.read_csv('./rss_feeder/naked_science.csv')
    with Session() as session:

        def create_news(row):
            author = None
            if row['author']:
                stmt = select(Author).where(Author.author_name == row['author'])
                res = session.execute(stmt).one_or_none()
                if not res:
                    author = Author(author_name=row['author'])
                    session.add(author)
                    session.flush()
                else:
                    author = res[0]
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
                authors=[author],
                magazine='Naked Science',
                link=row['link'],
            )

            session.add(article)

        # def create_news(row):
        #     article = Article(
        #         title=row['title'],
        #         type='news',
        #         category=row['category'],
        #         publication_date=date(2024, 12, 19),
        #         content=row['plain_text'],
        #         authors=[row['author']],
        #         link=row['link'],
        #     )
        #     article_service.create_article(Session, article)

        news_df.apply(create_news, axis=1)
        session.commit()
    # articles = article_service.get_articles(Session)
    # print(articles[0])


def drop_tables():
    Base.metadata.drop_all(engine)


if __name__ == '__main__':
    create_tables()
