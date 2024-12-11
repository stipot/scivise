from app.models.models import Article
from app.models.base import Base, engine, Session
from app.services import auth as auth_service, article as article_service
import pandas as pd


def create_tables():
    Base.metadata.create_all(engine)
    df = pd.read_csv('./rss_feeder/naked_science.csv')
    article = Article()
    article_service.create_article(
        Session=Session,
    )
    auth_service.register_user(Session=Session, username='test', password='1111')


def drop_tables():
    Base.metadata.drop_all(engine)


if __name__ == '__main__':
    create_tables()
