from dataclasses import dataclass
from typing import List
from sqlalchemy import (
    CheckConstraint,
    Column,
    ForeignKey,
    String,
    Table,
    UniqueConstraint,
    Integer,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base


# favorite_articles = Table(
#     'favorite_articles',
#     Base.metadata,
#     Column('article_id', ForeignKey('articles.id')),
#     Column('user_id', ForeignKey('users.id')),
# )


# @dataclass
# class Article(Base):
#     __tablename__ = "articles"
#     __table_args__ = (UniqueConstraint('title', 'authors'),)

#     id: Mapped[int] = mapped_column(primary_key=True)
#     title: Mapped[str] = mapped_column(String(255))
#     annotation: Mapped[str] = mapped_column(String(1000))
#     keywords: Mapped[str]
#     content: Mapped[str]


@dataclass
class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint('username'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(255))
    # favorites: Mapped[List[Article]] = relationship(secondary=favorite_articles)

    def __str__(self) -> str:
        return f'''
        User(
            id={self.id},
            username={self.username},
            password={self.password}
        )
        '''
