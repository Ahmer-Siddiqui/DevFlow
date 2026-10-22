# Rule 04: Build, Execution & Monorepo Operational Guidelines

## 🛠️ 1. Workspace Commands & Scripts

DevFlow uses npm workspaces. You can run all development, build, and test operations from the repository root:

| Command | Action | Scope |
| :--- | :--- | :--- |
| `npm run dev:backend` | Starts Express server with `ts-node-dev` on port 5000 | `backend` |
| `npm run dev:frontend` | Starts Vite dev server on port 5173 | `frontend` |
| `npm run build:backend` | Compiles TypeScript into `backend/dist` | `backend` |
| `npm run build:frontend` | Type-checks and creates production Vite bundle | `frontend` |
| `npm run test:backend` | Executes Jest backend test suite | `backend` |

---

## 🗄️ 2. Database Migration Operations

TypeORM migrations must be run through the backend workspace:

```bash
# Generate a migration based on entity differences:
npm --workspace=backend run migration:generate -- src/database/migrations/<MigrationName>

# Run all pending migrations:
npm --workspace=backend run migration:run

# Revert the last applied migration:
npm --workspace=backend run migration:revert
```

---

## 🔑 3. Environment Configuration

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
JWT_ACCESS_SECRET=your_jwt_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env.development`)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```
