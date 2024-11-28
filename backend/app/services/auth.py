from sqlalchemy.orm import sessionmaker, Session


def register_user(Session: sessionmaker[Session], username: str, password: str): ...


def authorize_user(Session: sessionmaker[Session], username: str, password: str): ...
