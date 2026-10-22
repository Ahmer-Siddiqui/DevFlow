# DevFlow — Active Project Context

## 1. System Summary
- **App Name:** DevFlow
- **Type:** Multi-Tenant B2B SaaS Project Management & Issue Tracking Platform
- **Repository Structure:** npm Monorepo with `backend` (Express/TypeORM) and `frontend` (React/Vite).

---

## 2. Ports & Network Interfaces
- **Backend API:** `http://localhost:5000` (API root: `/api/v1`)
- **Frontend Client:** `http://localhost:5173`
- **WebSocket Gateway:** `ws://localhost:5000` (via Socket.IO)
- **Redis Server:** `redis://localhost:6379`

---

## 3. Database Schema Overview (Target Architecture)
- `users`: User identity, credentials, preferences.
- `organizations`: Tenant workspaces.
- `organization_members`: User-organization role mapping (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
- `projects`: Projects scoped to organizations (`DEV`, `PROD` keys).
- `project_members`: Project-level permissions.
- `tasks`: Core work item with status, priority, order, type, due dates.
- `comments`: Discussion threads with user mentions.
- `audit_logs`: Immutable security action log per organization.
- `notifications`: In-app notification records.
