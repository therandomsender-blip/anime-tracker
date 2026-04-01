from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class WatchStatus(str, enum.Enum):
    watching = "watching"
    completed = "completed"
    plan_to_watch = "plan_to_watch"
    dropped = "dropped"
    on_hold = "on_hold"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    collection = relationship("CollectionEntry", back_populates="user", cascade="all, delete")

class CollectionEntry(Base):
    __tablename__ = "collection_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mal_id = Column(Integer, nullable=False)          # MyAnimeList anime ID
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    cover_image_url = Column(String, nullable=True)
    episodes = Column(Integer, nullable=True)
    episodes_watched = Column(Integer, default=0)
    status = Column(Enum(WatchStatus), default=WatchStatus.plan_to_watch)
    user_rating = Column(Float, nullable=True)        # 1.0 - 10.0
    notes = Column(Text, nullable=True)
    genres = Column(String, nullable=True)            # comma-separated
    year = Column(Integer, nullable=True)
    mal_score = Column(Float, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user = relationship("User", back_populates="collection")
