from flask import Blueprint
from app.services import users as users_service

users_router = Blueprint('users', __name__, url_prefix='/')


@users_router.post('/add_user')
def add_user():
    user_id = users_service.create_user()
    return user_id, 200
