# Inspirit AI

## Stack
- Frontend: React 19 + TypeScript 6 + Vite 8 + TanStack Router + TanStack Query + Tailwind CSS 4 + Lucide React
- Backend: Bun + Hono + TypeScript 6 + postgres PostgreSQL driver
- Database: PostgreSQL
- DevOps: Docker Compose

## Run locally
1. Install Bun and Node.js.
2. Copy .env.example to .env.
3. Start PostgreSQL with Docker Compose:
   ```bash
   docker compose up -d db
   ```
4. Start backend:
   ```bash
   cd backend && bun install && bun run dev
   ```
5. Start frontend:
   ```bash
   cd frontend && npm install && npm run dev
   ```

## Notes
- The backend exposes a health endpoint at /health.
- The frontend includes a simple home screen and health route.
