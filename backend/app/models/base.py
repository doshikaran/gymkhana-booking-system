# app/models/base.py
from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy import MetaData
import datetime

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
metadata = MetaData(naming_convention=convention)

class Base(DeclarativeBase):
    metadata = metadata

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    def __repr__(self) -> str:
        cols = ", ".join(f"{c.name}={getattr(self, c.name)}" for c in self.__table__.columns)
        return f"<{self.__class__.__name__}({cols})>"

    @declared_attr
    def created_at(cls):
        return datetime.datetime.now(datetime.timezone.utc)
