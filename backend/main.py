from flask import Flask
from flask_cors import CORS
from app.models.core import create_tables, drop_tables
from app.routers import articles
from app.models.base import Session
import uuid
from app.models.models import Users


def get_app():
    app = Flask(__name__)
    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.register_blueprint(articles.articles_router)
    # drop_tables()
    # create_tables()
    return app


if __name__ == '__main__':
    app = get_app()

    @app.post('/add_user')
    def add_user():
        with Session() as session:
            user_id = uuid.uuid4()
            session.add(Users(id=str(user_id)))
            session.commit()
        return str(user_id), 200

    app.run(debug=True, port=3010)
