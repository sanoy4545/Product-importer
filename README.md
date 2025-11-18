# Product Importer Monorepo

This project is a monorepo for a product management and import system, featuring:

- **backend/** — FastAPI, Celery, SQLAlchemy, PostgreSQL
- **frontend/** — Vite + React (TypeScript)

## Features

- Product CRUD (create, read, update, delete)
- CSV product import with progress tracking (Celery background task)
- Webhook management and testing
- Filtering, pagination, and status toggling
- Modern UI with modals, tables, and toast notifications

## Getting Started

### Backend (FastAPI)

1. Make sure Redis is running locally (default port 6379):
   - On Linux/macOS: `redis-server`
   - On Windows: use [Memurai](https://www.memurai.com/) or [Redis for Windows](https://github.com/microsoftarchive/redis/releases)

2. Open a terminal and navigate to the backend folder:
   ```sh
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   # For Celery worker (in a separate terminal):
   celery -A backend.workers.celery_app worker --loglevel=info --pool=solo
   ```

### Frontend (React)

1. Open another terminal and navigate to the frontend folder:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

### Configuration

- Set environment variables in `backend/.env` and `frontend/.env` as needed (API URLs, DB connection, etc).
- If backend and frontend run on different ports, enable CORS in FastAPI or set up a proxy in `frontend/vite.config.js`.

## Development Tips

- Use two terminals: one for FastAPI, one for Celery worker.
- For local development, ensure PostgreSQL and Redis are running.
- Backend uses async SQLAlchemy and Pydantic for models/schemas.
- Frontend uses React hooks for API calls, state, and UI logic.

## Suggestions

- Add CORS middleware to backend for easier local dev
- Add a proxy in `frontend/vite.config.js` for same-origin requests
- Add ESLint, Prettier, and CI for code quality

## License

MIT
