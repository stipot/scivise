from flask_jwt_extended import create_access_token, create_refresh_token
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import select
from passlib.hash import bcrypt
from errors import AlreadyExistsError, NotFoundError
from models.models import User


def register_user(Session: sessionmaker[Session], username: str, password: str):
    with Session() as session:
        statement = select(User).where(User.username == username)
        candidate = session.execute(statement).scalar_one_or_none()
        if candidate:
            raise AlreadyExistsError('Пользователь уже существует')
        user = User(username=username, password=bcrypt.hash(password))
        session.add(user)
        session.commit()


def authorize_user(Session: sessionmaker[Session], username: str, password: str):
    with Session() as session:
        statement = select(User).where(User.username == username)
        candidate = session.execute(statement).scalar_one_or_none()
        if not candidate:
            raise NotFoundError('Пользователь не найден')
        if not bcrypt.verify(password, candidate.password):
            raise ValueError('Неправильный пароль')
        access_token = create_access_token(identity=[candidate.username, candidate.id])
        refresh_token = create_refresh_token(
            identity=[candidate.username, candidate.id]
        )
        info = {
            'username': candidate.username,
            'access': access_token,
            'refresh': refresh_token,
        }
        return info
