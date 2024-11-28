from typing import TypedDict
from flask import Blueprint, make_response, request
from errors import AlreadyExistsError, NotFoundError
from models.base import Session
from services import auth as auth_service

auth = Blueprint('auth', __name__, url_prefix='/auth')


class AuthData(TypedDict):
    username: str
    password: str


@auth.route('/authorization', methods=["POST"])
def authorization():
    try:
        user_data: AuthData = request.get_json()
        info = auth_service.authorize_user(
            Session=Session,
            username=user_data['username'],
            password=user_data['password'],
        )
        response = make_response(info)
        return response, 200
    except ValueError as e:
        return str(e), 400
    except NotFoundError as e:
        return str(e), 404
    except KeyError:
        return 'Обязательные параметры пустые', 400


@auth.route('/registration', methods=["POST"])
def registration():
    try:
        user_data: AuthData = request.get_json()
        auth_service.register_user(
            Session=Session,
            username=user_data['username'],
            password=user_data['password'],
        )
        return '', 200
    except AlreadyExistsError as e:
        return str(e), 400
    except KeyError:
        return 'Обязательные параметры пустые', 400
