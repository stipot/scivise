from flask import Flask
from flask_cors import CORS
from app.models.core import create_tables, drop_tables


app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


if __name__ == '__main__':
    drop_tables()
    create_tables()
    app.run(debug=True, port=3010)
