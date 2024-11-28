from models.base import Base, engine, Session
from services import auth as auth_service


def create_tables():
    Base.metadata.create_all(engine)

    auth_service.register_user(Session=Session, username='test', password='1111')


def drop_tables():
    Base.metadata.drop_all(engine)


if __name__ == '__main__':
    create_tables()
