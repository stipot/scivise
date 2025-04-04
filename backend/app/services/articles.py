from sqlalchemy import delete, select, insert
from sqlalchemy.orm import sessionmaker, Session, selectinload
from app.models.models import Article, Author, users_articles


def get_articles(
    Session: sessionmaker[Session],
    user_id: str,
    page: int = 1,
    limit: int = 10,
    shown_article_ids: list = None,
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
            .join(Article.authors)
            .where(users_articles.c.user_id.is_(None))
        )
        if shown_article_ids:
            stmt = stmt.where(Article.id.not_in(shown_article_ids))
        print(stmt)
        articles = (
            session.execute(stmt.options(selectinload(Article.authors))).scalars().all()
        )
        return articles


def get_filters_values(Session: sessionmaker[Session]):
    with Session() as session:
        authors = session.execute(select(Author.author_name)).scalars().all()
        categories = (
            session.execute(select(Article.category).distinct()).scalars().all()
        )
        keywords = []
        return {'keywords': keywords, 'categories': categories, 'authors': authors}


def get_article(Session: sessionmaker[Session], article_id: int):
    with Session() as session:
        stmt = select(Article).join(Article.authors).where(Article.id == article_id)
        article = (
            session.execute(stmt.options(selectinload(Article.authors)))
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


def create_article(Session: sessionmaker[Session], article: Article):
    with Session() as session:
        authors = []
        for author_name in article.authors:
            stmt = select(Author).where(Author.author_name == author_name)
            res = session.execute(stmt).one_or_none()
            if not res:
                author = Author(author_name=author_name)
                session.add(author)
                session.flush()
            else:
                author = res[0]
            authors.append(author)
        article.authors = authors
        session.add(article)
        session.commit()
