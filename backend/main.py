import os
from flask import Flask
from flask_cors import CORS
from app.models.core import fast_create_tables, drop_tables
from app.routers import articles, users
from elasticsearch import Elasticsearch


def create_elastic_index(es: Elasticsearch):
    if es.indices.exists(index='scivise_articles'):
        es.indices.delete(index='scivise_articles')
    mappings = {
        'properties': {
            'id': {'type': 'long'},
            'title': {'type': 'text'},
            'category': {'type': 'text'},
            'annotation': {'type': 'text'},
            'publication_date': {'type': 'date', 'format': 'dd.MM.yyyy'},
            'keywords': {'type': 'text'},
            'authors': {'type': 'text'},
            'magazine': {'type': 'text'},
            'link': {'type': 'keyword'},
        }
    }

    es.indices.create(index='scivise_articles', mappings=mappings)


def get_app():
    app = Flask(__name__)
    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    # app.es = Elasticsearch('http://elasticsearch:9200')
    app.es = Elasticsearch(
        os.getenv('ES_ADDRESS')
        if os.getenv('ES_ADDRESS')
        else 'http://172.21.216.28:9200'
    )
    app.register_blueprint(articles.articles_router)
    app.register_blueprint(users.users_router)
    create_elastic_index(app.es)
    drop_tables()
    fast_create_tables(app.es)
    return app


if __name__ == '__main__':
    app = get_app()
    app.run(debug=True, port=3010)
