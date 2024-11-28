from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routers.auth import auth


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'rewritesecret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 86400  # seconds / 24 hours
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
jwt = JWTManager(app)
CORS(
    app,
    origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
    supports_credentials=True,
)
app.register_blueprint(auth)
app.config['CORS_HEADERS'] = 'Content-Type'


if __name__ == '__main__':
    app.run(debug=True, port=3010)
