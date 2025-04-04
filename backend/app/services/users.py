import uuid
from app.models.base import Session
from app.models.models import User


def create_user():
    with Session() as session:
        user_id = uuid.uuid4()
        session.add(User(id=str(user_id)))
        session.commit()
    return str(user_id)
