from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models.core import create_tables, drop_tables
from routers.auth import auth


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'rewritesecret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 86400  # seconds / 24 hours
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
jwt = JWTManager(app)
CORS(app)
app.register_blueprint(auth)
app.config['CORS_HEADERS'] = 'Content-Type'


if __name__ == '__main__':
    drop_tables()
    create_tables()
    app.run(debug=True, port=3010)
