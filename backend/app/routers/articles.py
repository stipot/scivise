from flask import Blueprint, make_response, request

articles_router = Blueprint('articles', __name__, url_prefix='/articles')


@articles_router.get('/')
def get_article():
    pass
