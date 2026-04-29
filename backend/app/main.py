from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, collection, anime

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Anime Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://therandomsender-anivault.vercel.app"],  # Replace with your Vercel URL in production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"DB startup warning: {e}")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(collection.router, prefix="/api/collection", tags=["collection"])
app.include_router(anime.router, prefix="/api/anime", tags=["anime"])

@app.get("/")
def root():
    return {"message": "Anime Tracker API is running 🎌"}
          