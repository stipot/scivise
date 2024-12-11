from typing import TypedDict
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import select
from app.models.models import Article


def create_article(Session: sessionmaker[Session], article: Article):
    pass
