from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.core.database import get_db
from app.core.security import decode_token
from app.models.models import User, CollectionEntry, WatchStatus
from app.schemas.schemas import CollectionEntryCreate, CollectionEntryUpdate, CollectionEntryOut, CollectionStats

router = APIRouter()

def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/", response_model=list[CollectionEntryOut])
def get_collection(
    status: Optional[WatchStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    q = db.query(CollectionEntry).filter(CollectionEntry.user_id == current_user.id)
    if status:
        q = q.filter(CollectionEntry.status == status)
    return q.order_by(CollectionEntry.added_at.desc()).all()

@router.post("/", response_model=CollectionEntryOut)
def add_to_collection(
    entry: CollectionEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(CollectionEntry).filter(
        CollectionEntry.user_id == current_user.id,
        CollectionEntry.mal_id == entry.mal_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Anime already in collection")
    new_entry = CollectionEntry(**entry.dict(), user_id=current_user.id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.put("/{entry_id}", response_model=CollectionEntryOut)
def update_entry(
    entry_id: int,
    update: CollectionEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(CollectionEntry).filter(
        CollectionEntry.id == entry_id,
        CollectionEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(CollectionEntry).filter(
        CollectionEntry.id == entry_id,
        CollectionEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Deleted"}

@router.get("/stats/summary", response_model=CollectionStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entries = db.query(CollectionEntry).filter(CollectionEntry.user_id == current_user.id).all()
    ratings = [e.user_rating for e in entries if e.user_rating]
    return CollectionStats(
        total=len(entries),
        watching=sum(1 for e in entries if e.status == WatchStatus.watching),
        completed=sum(1 for e in entries if e.status == WatchStatus.completed),
        plan_to_watch=sum(1 for e in entries if e.status == WatchStatus.plan_to_watch),
        dropped=sum(1 for e in entries if e.status == WatchStatus.dropped),
        on_hold=sum(1 for e in entries if e.status == WatchStatus.on_hold),
        avg_rating=round(sum(ratings) / len(ratings), 1) if ratings else None,
        total_episodes_watched=sum(e.episodes_watched or 0 for e in entries)
    )
