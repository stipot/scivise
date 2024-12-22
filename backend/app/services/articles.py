from sqlalchemy import select
from sqlalchemy.orm import sessionmaker, Session, selectinload
from app.models.models import Article, Author


def get_articles(
    Session: sessionmaker[Session],
    page: int = 1,
    limit: int = 10,
    start_id: int | None = None,
):
    offset = limit * (page - 1)
    with Session() as session:
        stmt = select(Article)
        if start_id:
            stmt.where(Article.id >= start_id).order_by(Article.id)
        stmt = stmt.limit(limit).offset(offset).join(Article.authors)
        articles = (
            session.execute(stmt.options(selectinload(Article.authors))).scalars().all()
        )
        return articles


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
