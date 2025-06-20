from dataclasses import asdict
from flask import Blueprint, request, current_app
from app.services import articles as article_service
from app.models.base import Session

articles_router = Blueprint('articles', __name__, url_prefix='/api/articles')


@articles_router.get('/')
def get_articles():
    article_ids = request.args.getlist('article_ids[]', type=int)
    keywords = request.args.getlist('keywords[]', type=str)
    authors = request.args.getlist('authors[]', type=str)
    categories = request.args.getlist('categories[]', type=str)
    page = request.args.get('page', 1, type=int)
    user_id = request.args.get('user_id', type=str)
    articles = article_service.get_articles(
        Session,
        page=page,
        limit=12,
        user_id=user_id,
        shown_article_ids=article_ids,
        categories=categories,
        authors=authors,
        keywords=keywords,
    )
    articles = [asdict(article) for article in articles]
    return articles, 200


@articles_router.get('/article')
def get_article():
    article_id = request.args.get('article_id', type=int)
    article = article_service.get_article(Session=Session, article_id=article_id)
    print(article)
    return asdict(article), 200


@articles_router.get('/search')
def search_articles():
    search_phrase = request.args.get('search_phrase', type=str)
    last_sort = request.args.get('last_sort', type=str)
    last_sort = last_sort.split('_') if last_sort else []
    last_sort = (
        [float(last_sort[0]), int(last_sort[1])] if len(last_sort) == 2 else None
    )
    result = article_service.search_articles(
        es=current_app.es, search_phrase=search_phrase, search_after=last_sort
    )
    return result, 200


@articles_router.get('/filter_values')
def get_filter_values():
    filter_name = request.args.get('filter_name', type=str)
    start_val = request.args.get('start_val', type=str)
    filter_values = article_service.get_filter_values(
        Session, filter_name=filter_name, start_val=start_val
    )
    return filter_values, 200


@articles_router.post('/mark')
def mark_article():
    data = request.get_json()
    article_ids = data.get('article_ids')
    user_id = data.get('user_id')
    article_service.mark_article(Session, article_ids=article_ids, user_id=user_id)
    return '', 200


@articles_router.delete('/mark')
def delete_mark():
    data = request.get_json()
    article_ids = data.get('article_ids')
    user_id = data.get('user_id')
    article_service.delete_mark(Session, article_ids=article_ids, user_id=user_id)
    return '', 200
