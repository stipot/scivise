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
from app.models.base import Base


favorite_articles = Table(
    'favorite_articles',
    Base.metadata,
    Column('article_id', ForeignKey('articles.id')),
    Column('user_id', ForeignKey('users.id')),
)


authors_articles = Table(
    'authors_articles',
    Base.metadata,
    Column('user_id', ForeignKey('users.id')),
    Column('autor_name', String(255)),
    Column('article_id', ForeignKey('articles.id')),
)


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = (UniqueConstraint('title', 'type', 'category'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(
        String(40), CheckConstraint('type in ("news", "article")'), nullable=False
    )
    category: Mapped[str] = mapped_column(String(40), nullable=False)
    annotation: Mapped[str] = mapped_column(String(1000))
    keywords: Mapped[str] = mapped_column(String(255))
    content: Mapped[str]


class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint('username'),)

    id: Mapped[int] = mapped_column(primary_key=True, init=True)
    username: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(255))
    favorites: Mapped[List[Article]] = relationship(secondary=favorite_articles)
    published: Mapped[List[Article]] = relationship(secondary=authors_articles)

    def __str__(self) -> str:
        return f'''
        User(
            id={self.id},
            username={self.username},
            password={self.password}
        )
        '''
