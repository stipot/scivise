import uuid
from app.models.base import Session
from app.models.models import Users


def create_user():
    with Session() as session:
        user_id = uuid.uuid4()
        session.add(Users(id=str(user_id)))
        session.commit()
    return str(user_id)
