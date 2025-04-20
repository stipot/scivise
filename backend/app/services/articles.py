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
            stmt = stmt.where(Article.keywords.in_(keywords))

        if categories:
            stmt = stmt.where(Article.category.in_(categories))

        stmt = stmt.where(users_articles.c.user_id.is_(None))
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
            else:
                author = res[0]
            authors.append(author)
        session.flush()
        article.authors = authors

        # custom_kw_extractor = yake.KeywordExtractor(
        #     lan='ru',
        #     n=3,
        #     top=5,
        #     stopwords=stopwords,
        # )
        # keywords = custom_kw_extractor.extract_keywords(
        #     re.sub(
        #         r'\d+',
        #         '',
        #         article.annotation if article.annotation else article.content,
        #     )
        # )

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

        # morph = pymorphy3.MorphAnalyzer()
        # normal_keywords = []
        # for keyword in keywords:
        #     normal_keywords.append(
        #         ' '.join(
        #             [
        #                 morph.parse(word)[0].inflect({'nomn'}).word
        #                 for word in keyword[0].split()
        #             ]
        #         )
        #     )

        keywords = [item[0] for item in keywords]
        keywords = list(set(keywords))
        keywords.extend(article.keywords)
        article.keywords = []
        for keyword in keywords:
            stmt = select(Keyword).where(Keyword.keyword == keyword)
            res = session.execute(stmt).one_or_none()
            if not res:
                keyword_obj = Keyword(keyword=keyword)
                session.add(keyword_obj)
            else:
                keyword_obj = res[0]
            article.keywords.append(keyword_obj)
        session.flush()

        session.add(article)
        session.commit()
