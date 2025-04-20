from typing import List
from sqlalchemy import (
    CheckConstraint,
    Column,
    ForeignKey,
    String,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

authors_articles = Table(
    'authors_articles',
    Base.metadata,
    Column('autor_id', ForeignKey('authors.id')),
    Column('article_id', ForeignKey('articles.id')),
)

users_articles = Table(
    'users_articles',
    Base.metadata,
    Column('user_id', ForeignKey('users.id')),
    Column('article_id', ForeignKey('articles.id')),
    UniqueConstraint('user_id', 'article_id'),
)

article_keywords = Table(
    'article_keywords',
    Base.metadata,
    Column('keyword_id', ForeignKey('keywords.id')),
    Column('article_id', ForeignKey('articles.id')),
    UniqueConstraint('keyword_id', 'article_id'),
)


class Keyword(Base):
    __tablename__ = "keywords"
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    keyword: Mapped[str] = mapped_column(String(255))


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(primary_key=True, init=True)


class Author(Base):
    __tablename__ = "authors"
    __table_args__ = (UniqueConstraint('author_name'),)

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    author_name: Mapped[str] = mapped_column(String(255))


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = (UniqueConstraint('title', 'type', 'category'),)

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(
        String(40), CheckConstraint('type in ("news", "article")'), nullable=False
    )
    category: Mapped[str] = mapped_column(String(40), nullable=False)
    annotation: Mapped[str] = mapped_column(String(1000), init=False, nullable=True)
    keywords: Mapped[List[Keyword]] = relationship(secondary=article_keywords)
    publication_date: Mapped[str] = mapped_column(String(10))
    content: Mapped[str]
    authors: Mapped[List[Author]] = relationship(secondary=authors_articles)
    magazine: Mapped[str] = mapped_column(String(255), nullable=False)
    link: Mapped[str] = mapped_column(String(255), nullable=False)
