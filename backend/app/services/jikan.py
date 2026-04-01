import httpx
from app.core.config import settings

async def search_anime(query: str, page: int = 1):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{settings.JIKAN_BASE_URL}/anime",
            params={"q": query, "page": page, "limit": 20, "sfw": True},
            timeout=10.0
        )
        r.raise_for_status()
        return r.json()

async def get_anime_by_id(mal_id: int):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{settings.JIKAN_BASE_URL}/anime/{mal_id}", timeout=10.0)
        r.raise_for_status()
        return r.json()

async def get_seasonal_anime(year: int, season: str):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{settings.JIKAN_BASE_URL}/seasons/{year}/{season}",
            params={"limit": 24},
            timeout=10.0
        )
        r.raise_for_status()
        return r.json()

async def get_top_anime(page: int = 1):
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{settings.JIKAN_BASE_URL}/top/anime",
            params={"page": page, "limit": 20},
            timeout=10.0
        )
        r.raise_for_status()
        return r.json()
