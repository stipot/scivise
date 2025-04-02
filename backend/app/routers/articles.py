from dataclasses import asdict
from flask import Blueprint, request
from app.services import articles as article_service
from app.models.base import Session

articles_router = Blueprint('articles', __name__, url_prefix='/articles')


@articles_router.get('/')
def get_articles():
    article_ids = request.args.getlist('article_ids[]', type=int)
    page = request.args.get('page', 1, type=int)
    user_id = request.args.get('user_id', type=str)
    articles = article_service.get_articles(
        Session, page=page, limit=12, user_id=user_id, shown_article_ids=article_ids
    )
    articles = [asdict(article) for article in articles]
    return articles, 200


@articles_router.get('/article')
def get_article():
    article_id = request.args.get('article_id', type=int)
    article = article_service.get_article(Session=Session, article_id=article_id)
    print(article)
    return asdict(article), 200


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
