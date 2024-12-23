from flask import Flask
from flask_cors import CORS
from app.models.core import create_tables, drop_tables
from app.routers import articles

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.register_blueprint(articles.articles_router)

if __name__ == '__main__':
    drop_tables()
    create_tables()
    app.run(debug=True, port=3010)
