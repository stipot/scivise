from flask import Flask
from flask_cors import CORS
from app.models.core import create_tables, drop_tables
from app.routers import articles, users


def get_app():
    app = Flask(__name__)
    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.register_blueprint(articles.articles_router)
    app.register_blueprint(users.users_router)
    drop_tables()
    create_tables()
    return app


if __name__ == '__main__':
    app = get_app()
    app.run(debug=True, port=3010)
