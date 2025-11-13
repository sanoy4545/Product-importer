# Product (monorepo)

This workspace contains two folders:

- `backend/` — Node + Express API
- `frontend/` — Vite + React frontend

Getting started

1. Open two terminals.

Backend:

    cd backend
    npm install
    npm run dev    # or npm start

Frontend:

    cd frontend
    npm install
    npm run dev

If the backend runs on a different port than the frontend (e.g., backend on 3001), either enable CORS on the backend or configure a dev proxy in Vite to forward `/api` requests to the backend.

Next suggestions

- Add CORS middleware to backend for easier local dev
- Add a small proxy in `frontend/vite.config.js` if you prefer same-origin requests
- Add ESLint / Prettier and CI if you plan to expand the project
