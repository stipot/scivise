from dataclasses import asdict
from flask import Blueprint, request
from app.services import articles as article_service
from app.models.base import Session

articles_router = Blueprint('articles', __name__, url_prefix='/articles')


@articles_router.get('/')
def get_article():
    page = request.args.get('page', 1, type=int)
    start_id = request.args.get('start_id', type=int)
    articles = article_service.get_articles(Session, page=page, start_id=start_id)
    articles = [asdict(article) for article in articles]
    return articles, 200
