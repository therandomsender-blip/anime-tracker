from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.models import WatchStatus

# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    avatar_url: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# ── Collection ────────────────────────────────────────
class CollectionEntryCreate(BaseModel):
    mal_id: int
    title: str
    image_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    episodes: Optional[int] = None
    episodes_watched: int = 0
    status: WatchStatus = WatchStatus.plan_to_watch
    user_rating: Optional[float] = None
    notes: Optional[str] = None
    genres: Optional[str] = None
    year: Optional[int] = None
    mal_score: Optional[float] = None

class CollectionEntryUpdate(BaseModel):
    status: Optional[WatchStatus] = None
    user_rating: Optional[float] = None
    notes: Optional[str] = None
    episodes_watched: Optional[int] = None

class CollectionEntryOut(CollectionEntryCreate):
    id: int
    user_id: int
    added_at: datetime
    updated_at: Optional[datetime]
    class Config:
        from_attributes = True

# ── Stats ─────────────────────────────────────────────
class CollectionStats(BaseModel):
    total: int
    watching: int
    completed: int
    plan_to_watch: int
    dropped: int
    on_hold: int
    avg_rating: Optional[float]
    total_episodes_watched: int
