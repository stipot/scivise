from flask import Flask
from flask_cors import CORS
from app.models.core import create_tables, drop_tables
from app.routers import articles
from app.models.base import Session
import uuid
from app.models.models import Users

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(articles.articles_router)


@app.post('/add_user')
def add_user():
    with Session() as session:
        user_id = uuid.uuid4()
        session.add(Users(id=str(user_id)))
        session.commit()
    return str(user_id), 200


if __name__ == '__main__':
    # drop_tables()
    # create_tables()
    app.run(debug=True, port=3010)
