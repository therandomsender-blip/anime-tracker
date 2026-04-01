# 🎌 AniVault — Anime Collection Tracker

A full-stack anime collection tracker built with **React + FastAPI**, deployed on **Vercel + Railway**.

---

## 🗂️ Features

- 🔐 JWT Authentication (register / login)
- 🔍 Search anime via Jikan (MyAnimeList) API
- ➕ Add anime to your personal vault with status, rating & notes
- 📊 Dashboard with collection stats
- ✏️ Edit and delete collection entries
- 📱 Responsive dark UI

---

## 🏗️ Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, TailwindCSS, React Query, Zustand |
| Backend   | FastAPI, SQLAlchemy, PostgreSQL   |
| Auth      | JWT (python-jose + passlib bcrypt)|
| Anime API | Jikan v4 (free MyAnimeList API)   |
| Deploy FE | Vercel                            |
| Deploy BE | Railway (+ Railway PostgreSQL)    |

---

## 🚀 Local Development

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# Run server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend at: http://localhost:3000

---

## ☁️ Deployment

### Backend → Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo, set root directory to `backend/`
4. Add a **PostgreSQL** plugin from Railway dashboard
5. Set environment variables:
   ```
   DATABASE_URL=<auto-filled by Railway PostgreSQL plugin>
   SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
   ```
6. Railway will auto-detect the `Dockerfile` and deploy
7. Copy your Railway service URL (e.g. `https://anivault-backend.up.railway.app`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set **Root Directory** to `frontend/`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
4. Deploy!

### Final Step: Update CORS

In `backend/app/main.py`, replace `allow_origins=["*"]` with your Vercel URL:
```python
allow_origins=["https://your-app.vercel.app"]
```

---

## 📁 Project Structure

```
anime-tracker/
├── backend/
│   ├── app/
│   │   ├── core/        # config, database, security
│   │   ├── models/      # SQLAlchemy models
│   │   ├── routers/     # auth, collection, anime endpoints
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Jikan API client
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios client + API functions
    │   ├── components/  # Layout, AnimeCard, Modals
    │   ├── pages/       # Dashboard, Collection, Search, Detail
    │   ├── store/       # Zustand auth store
    │   └── App.jsx
    └── vercel.json
```

---

## 🔑 API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | `/api/auth/register`            | Register new user        |
| POST   | `/api/auth/login`               | Login, get JWT token     |
| GET    | `/api/anime/search?q=naruto`    | Search anime             |
| GET    | `/api/anime/top`                | Top anime list           |
| GET    | `/api/anime/{mal_id}`           | Anime detail             |
| GET    | `/api/collection/`              | Get user collection      |
| POST   | `/api/collection/`              | Add anime to collection  |
| PUT    | `/api/collection/{id}`          | Update entry             |
| DELETE | `/api/collection/{id}`          | Remove from collection   |
| GET    | `/api/collection/stats/summary` | Collection stats         |
