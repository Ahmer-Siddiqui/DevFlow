# DevFlow — Full-Stack Monorepo Agent Master Instructions & Project Architecture

Welcome to the **DevFlow** codebase. This document outlines the project domain, architecture, full-stack guidelines, coding standards, and operational workflows for AI coding assistants.

---

## 1. Project Overview & Business Domain
- **Project Name:** DevFlow (`devflow-monorepo`)
- **Domain:** Enterprise Multi-Tenant SaaS Project Management & Team Collaboration Platform (Alternative to Linear, Jira, and ClickUp).
- **Core Modules & Capabilities:**
  - **Multi-Tenant Organizations & RBAC:** Organization workspaces, strict tenant data isolation, dynamic roles (`Owner`, `Admin`, `Member`, `Viewer`).
  - **Project & Workflow Management:** Organization-scoped projects, custom workflows, task prioritization, sprint-based delivery.
  - **Interactive Kanban Board:** Real-time drag-and-drop task boards powered by `@dnd-kit`, multi-column state transitions, and persistent position ordering.
  - **Task Engine & Collaboration:** Rich task descriptions, checklists, tags, assignees, subtasks, user mentions (`@user`), and comment threads.
  - **Real-Time Collaboration Engine:** Distributed WebSockets via `Socket.IO` with Redis adapter, presence indicators, live board syncing, and instant updates.
  - **In-App & Email Notifications:** Event-driven notification pipeline with BullMQ background workers and in-app bell dropdown.
  - **Security & Audit Logs:** Immutable tenant-scoped audit logging for compliance, role checks, and enterprise security policies.
  - **Dashboard Analytics:** Visual workload distribution, sprint burn-down, task completion metrics via `Recharts`.

---

## 2. Tech Stack & Dependencies

### Monorepo Infrastructure
- **Root Management:** npm Workspaces (`workspaces: ["backend", "frontend"]`).
- **Unified Scripts:**
  - `npm run dev:backend` — Run Express server via `ts-node-dev`.
  - `npm run dev:frontend` — Run Vite dev server.
  - `npm run build:backend` — Compile TypeScript to `backend/dist`.
  - `npm run build:frontend` — Build optimized React production bundle.
  - `npm run test:backend` — Execute Jest unit and integration tests.

### Backend (`/backend`)
- **Runtime & Framework:** Node.js, Express (`express@^4.21.2`), TypeScript (`typescript@^5.8.2`).
- **Database & ORM:** PostgreSQL (via Supabase / Local), TypeORM (`typeorm@^0.3.21`), `pg@^8.13.3`.
- **Cache & Message Broker:** Redis (`ioredis@^5.6.0`), BullMQ (`bullmq@^5.41.0`).
- **Real-Time:** Socket.IO (`socket.io@^4.8.1`), `@socket.io/redis-adapter@^8.3.0`.
- **Validation & Security:** Zod (`zod@^3.24.2`), Bcrypt (`bcrypt@^5.1.1`), JWT (`jsonwebtoken@^9.0.2`), Helmet, CORS, Express-Rate-Limit.
- **Logging & Docs:** Winston (`winston@^3.17.0`), Swagger (`swagger-ui-express@^5.0.1`, `swagger-jsdoc@^6.2.8`).
- **Testing:** Jest, Supertest, ts-jest.

### Frontend (`/frontend`)
- **Framework & Build:** React 19 (`react@^19.0.0`), Vite (`vite@^6.2.0`), TypeScript.
- **Routing:** React Router v7 (`react-router-dom@^7.3.0`).
- **Styling:** Tailwind CSS (`tailwindcss@^3.4.17`), PostCSS, Lucide Icons (`lucide-react@^1.16.0`), `clsx`, `tailwind-merge`.
- **State Management & Caching:** Zustand (`zustand@^5.0.3`), TanStack Query v5 (`@tanstack/react-query@^5.67.2`).
- **Interactive Kanban:** `@dnd-kit/core@^6.3.1`, `@dnd-kit/sortable@^10.0.0`, `@dnd-kit/utilities@^3.2.2`.
- **Forms & Validation:** React Hook Form (`react-hook-form@^7.54.2`), Zod (`zod@^3.24.2`), `@hookform/resolvers@^4.1.3`.
- **Charts & Visualization:** Recharts (`recharts@^2.15.1`).
- **Real-Time Client:** `socket.io-client@^4.8.1`.

---

## 3. Monorepo Architectural Design & Layering Rules

### ⚙️ Backend 4-Layer Architecture (`/backend/src`)
```
[ Client / WebSockets ]
        │
        ▼
[ Routes & Middlewares (src/routes, src/middlewares) ]
        │  (Auth, Tenant Isolation, RBAC, Zod Validation)
        ▼
[ Controllers (src/controllers) ]
        │  (HTTP / Presentation Layer only, DTO extraction)
        ▼
[ Services (src/services) ] ◄── Interfaces: src/core/IServices
        │  (Business logic, Transactions, Sockets, Jobs)
        ▼
[ Repositories (src/repositories) ] ◄── Interfaces: src/core/IRepositories
        │  (Data access, QueryBuilder, Tenant enforcement)
        ▼
[ Entities & Database (src/entities, TypeORM / PostgreSQL) ]
```

#### Strict Backend Constraints:
1. **Controllers NEVER access Repositories or TypeORM directly.** Controllers only interact with injected Services.
2. **Services NEVER call raw database connections directly.** All data access must go through dedicated Repository classes.
3. **Tenant Isolation Invariant:** Every query targeting an organization-scoped entity MUST include `organizationId` in the `WHERE` clause.
4. **Zod Validation at the Boundary:** Every incoming HTTP body, param, and query must be strictly validated before reaching controllers.
5. **No Long Explanatory Comments in Code:** Code must be self-documenting and clean. Deep architectural discussions belong in Markdown or user conversation.

### 🎨 Frontend Feature-First Architecture (`/frontend/src`)
```
src/
├── assets/          # Static assets, logos, brand vectors
├── components/      # Global shared UI primitives (Button, Modal, Input, Badge, Dropdown)
├── config/          # Environment constants, API endpoints, socket configs
├── context/         # Lightweight React contexts (Theme, SocketProvider)
├── features/        # Domain modules (auth, orgs, projects, tasks, kanban, analytics)
│   └── <feature>/
│       ├── api/         # Axios/fetch calls and TanStack Query hooks (queries & mutations)
│       ├── components/  # Feature-specific UI components
│       ├── hooks/       # Custom React logic hooks
│       ├── stores/      # Zustand store slices for client UI state
│       └── types/       # TypeScript interfaces & DTOs
├── layouts/         # App layouts (AuthLayout, DashboardLayout, ProjectLayout)
├── lib/             # Axios instance, queryClient, socket singleton, utils (`cn`)
├── pages/           # Routed page components
├── routes/          # React Router v7 configuration & ProtectedRoute guards
└── types/           # Global ambient TypeScript definitions
```

#### Strict Frontend Constraints:
1. **Separation of Concerns:** Components must remain lean and presentational. Business logic, API calls, and complex data transformations must live in Custom Hooks or Zustand stores.
2. **TanStack Query for Server State:** TanStack Query handles caching, deduplication, background refetching, and mutations. Zustand handles purely client-side UI state (e.g. sidebar open, active modal, drag overlays).
3. **Optimistic Updates for Kanban:** Drag-and-drop operations must update the local UI optimistically, while syncing the reordered state with the backend API via TanStack Query mutations.
4. **Zero Layout Shifts & Polished UX:** Every page and component must handle Loading (skeletons), Error (retry buttons), and Empty states elegantly.

---

## 4. Master Feature Progression & Tracking

DevFlow follows a strict **18-Phase Execution Roadmap**:
- Check progress in: [`FEATURE_TRACKER.md`](file:///d:/Backend%20Portfolio/DevFlow/FEATURE_TRACKER.md)
- Granular backend checkmarks: [`BACKEND_FEATURES.md`](file:///d:/Backend%20Portfolio/DevFlow/BACKEND_FEATURES.md)
- Granular frontend checkmarks: [`FRONTEND_FEATURES.md`](file:///d:/Backend%20Portfolio/DevFlow/FRONTEND_FEATURES.md)

### Teaching Mode Protocol:
When guiding the user through phases:
1. **Explain the Concept:** Break down why we need the feature, the data flow, and architectural pattern.
2. **Show Architectural Flow:** Visual diagram or step-by-step layer interaction.
3. **Implementation Guidance:** Step-by-step code files with clear explanation.
4. **Verification Questions / Testing:** Verify with Jest / Supertest / Manual UI validation.
5. **Check off the Tracker:** Update the markdown checklist items.

---

## 5. Rules Catalog (`.agents/rules/`)

- `00-senior-engineering-mentor.md`: Enterprise architect mindset, 7-stage framework, teaching protocol.
- `01-project-overview.md`: DevFlow SaaS specifications, business requirements, domain entities.
- `02-backend-architecture.md`: Express, TypeORM, 4-layer architecture, BullMQ, Redis, WebSockets.
- `03-frontend-architecture.md`: React 19, Vite, Tailwind, TanStack Query, Zustand, dnd-kit.
- `04-build-and-execution-guidelines.md`: Monorepo build, dev, test, migration commands.
- `05-feature-tracking-protocol.md`: Context synchronization, updating trackers, and compile gates.
- `06-verification-and-quality-gates.md`: Strict quality gates, type safety, linting, regression testing.
- `07-node-redis-concurrency-performance.md`: Express concurrency, Redis pub/sub, BullMQ job queuing.
- `08-postgresql-typeorm-database-performance.md`: Query optimization, composite indexes, tenant safety.
- `09-react-performance-and-rendering.md`: Render performance, virtualization, dnd-kit memoization.
- `10-production-grade-testing-standard.md`: Backend unit/integration tests and frontend testing standards.
- `11-ui-ux-design-standard.md`: Modern SaaS aesthetics, dark/light theme, fluid micro-interactions.
