from typing import TypedDict
from flask import Blueprint


auth = Blueprint('auth', __name__, url_prefix='/auth')


class AuthData(TypedDict):
    username: str
    password: str


@auth.route('/authorization', methods=["POST"])
def authorization(): ...


@auth.route('/registration', methods=["POST"])
def registration(): ...
