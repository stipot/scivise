from sqlalchemy import delete, select, insert
from sqlalchemy.orm import sessionmaker, Session, selectinload
from app.models.models import Article, Author, Keyword, users_articles
from keybert import KeyBERT
from flair.embeddings import TransformerDocumentEmbeddings
from app.stopwords.ru_stopwords import stopwords
import re

# import pymorphy3
# import yake


def get_articles(
    Session: sessionmaker[Session],
    user_id: str,
    page: int = 1,
    limit: int = 10,
    shown_article_ids: list = None,
    authors: list = None,
    categories: list = None,
    keywords: list = None,
):
    # offset = limit * (page - 1)
    with Session() as session:
        stmt = select(Article)
        stmt = (
            stmt.limit(limit)
            # .offset(offset)
            .outerjoin(
                users_articles,
                (users_articles.c.article_id == Article.id)
                & (users_articles.c.user_id == user_id),
            )
        )
        if shown_article_ids:
            stmt = stmt.where(Article.id.not_in(shown_article_ids))

        if authors:
            stmt = stmt.join(Article.authors).filter(Author.author_name.in_(authors))
        else:
            stmt = stmt.join(Article.authors)

        if keywords:
            stmt = stmt.join(Article.keywords).filter(Keyword.keyword.in_(keywords))

        stmt = stmt.group_by(Article.id)

        if categories:
            stmt = stmt.where(Article.category.in_(categories))

        stmt = stmt.where(users_articles.c.user_id.is_(None))
        articles = (
            session.execute(
                stmt.options(
                    selectinload(Article.authors), selectinload(Article.keywords)
                )
            )
            .scalars()
            .all()
        )
        return articles


def get_filter_values(
    Session: sessionmaker[Session], filter_name: str, start_val: str | None = None
):
    with Session() as session:
        if filter_name == 'categories':
            stmt = select(Article.category).distinct()

        if filter_name == 'authors':
            stmt = select(Author.author_name)
            if start_val:
                stmt = stmt.where(Author.author_name.startswith(start_val))
            stmt = stmt.limit(15)

        if filter_name == 'keywords':
            stmt = select(Keyword.keyword)
            if start_val:
                stmt = stmt.where(Keyword.keyword.startswith(start_val))
            stmt = stmt.limit(15)

        values = session.execute(stmt).scalars().all()
        return values


def get_article(Session: sessionmaker[Session], article_id: int):
    with Session() as session:
        stmt = (
            select(Article)
            .join(Article.authors)
            .join(Article.keywords)
            .group_by(Article.id)
            .where(Article.id == article_id)
        )
        article = (
            session.execute(
                stmt.options(
                    selectinload(Article.authors), selectinload(Article.keywords)
                )
            )
            .scalars()
            .all()[0]
        )
        return article


def mark_article(Session: sessionmaker[Session], article_ids: list, user_id: str):
    with Session() as session:
        stmt = insert(users_articles).values(
            [
                {'user_id': user_id, 'article_id': article_id}
                for article_id in article_ids
            ]
        )
        session.execute(stmt)
        session.commit()


def delete_mark(Session: sessionmaker[Session], article_ids: list, user_id: str):
    with Session() as session:
        stmt = delete(users_articles).where(
            (users_articles.c.user_id == user_id)
            & (users_articles.c.article_id.in_(article_ids))
        )
        session.execute(stmt)
        session.commit()


def create_article(
    Session: sessionmaker[Session], article: Article, gen_keywords: bool = True
):
    with Session() as session:
        authors = []
        for author_name in article.authors:
            stmt = select(Author).where(Author.author_name == author_name)
            res = session.execute(stmt).one_or_none()
            if not res:
                author = Author(author_name=author_name)
                session.add(author)
            else:
                author = res[0]
            authors.append(author)
        session.flush()
        article.authors = authors

        if gen_keywords:
            rubert = TransformerDocumentEmbeddings('cointegrated/rubert-tiny2')
            kw_model = KeyBERT(rubert)
            keywords = kw_model.extract_keywords(
                re.sub(
                    r'\d+',
                    '',
                    article.annotation if article.annotation else article.content,
                ),
                keyphrase_ngram_range=(1, 2),
                stop_words=stopwords,
                # use_mmr=True,
                # diversity=0.7,
                top_n=5,
            )

            keywords = [item[0] for item in keywords]
            keywords = list(set(keywords))
            article.keywords.extend(keywords)

        keywords = []
        for keyword in article.keywords:
            stmt = select(Keyword).where(Keyword.keyword == keyword)
            res = session.execute(stmt).one_or_none()
            if not res:
                keyword_obj = Keyword(keyword=keyword)
                session.add(keyword_obj)
            else:
                keyword_obj = res[0]
            keywords.append(keyword_obj)
        session.flush()
        article.keywords = keywords

        session.add(article)
        session.commit()
