from fastapi import APIRouter, Query
from app.services.jikan import search_anime, get_anime_by_id, get_seasonal_anime, get_top_anime

router = APIRouter()

@router.get("/search")
async def search(q: str = Query(..., min_length=1), page: int = 1):
    return await search_anime(q, page)

@router.get("/top")
async def top(page: int = 1):
    return await get_top_anime(page)

@router.get("/seasonal/{year}/{season}")
async def seasonal(year: int, season: str):
    return await get_seasonal_anime(year, season)

@router.get("/{mal_id}")
async def anime_detail(mal_id: int):
    return await get_anime_by_id(mal_id)
