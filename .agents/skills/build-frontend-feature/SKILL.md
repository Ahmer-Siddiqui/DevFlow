---
name: build-frontend-feature
description: "Procedural playbook for creating frontend features, pages, components, and state management in DevFlow with side-by-side automated test suites. Enforces the 8-stage workflow from TypeScript models, Axios API clients, TanStack Query hooks, Zustand stores, UI components, React Router wiring, Vitest component/hook tests, to closed-loop verification."
metadata:
  author: devflow-architect
  version: "1.1.0"
---

# Build Frontend Feature Playbook (DevFlow Pipeline)

Use this skill whenever instructed to build, implement, or polish any frontend feature or view in DevFlow Frontend. Every feature MUST include side-by-side automated test cases.

---

## 🏗️ The 8-Stage Frontend Execution Workflow

### Stage 1: Domain Types & Zod Schemas (`frontend/src/features/<feature>/types/`)
- Define TypeScript interfaces matching backend response DTOs.
- Infer form types from Zod schemas for submission payloads.

### Stage 2: API Client Functions (`frontend/src/features/<feature>/api/`)
- Create Axios API methods with explicit request/response typing.
- Handle token headers and query parameter serialization.

### Stage 3: TanStack Query Hooks (`frontend/src/features/<feature>/api/`)
- Implement `use<Feature>Query` for data fetching with appropriate cache time and query keys.
- Implement `use<Feature>Mutation` with optimistic UI cache updates (`queryClient.setQueryData`) and rollback error handlers.

### Stage 4: Zustand UI Store (`frontend/src/features/<feature>/stores/`)
- If feature requires local modal open/close states, active filter selections, or drag item states, create an atomic Zustand slice.

### Stage 5: Feature Components (`frontend/src/features/<feature>/components/`)
- Build modular, presentational components styled with Tailwind CSS.
- Ensure proper handling of Loading (Skeletons), Error (Banners/Retry), and Empty states.

### Stage 6: Page Integration & Route Wiring (`frontend/src/pages/`, `frontend/src/routes/`)
- Assemble the page in `frontend/src/pages/<Feature>Page.tsx`.
- Connect to React Router v7 inside `frontend/src/routes/` with `ProtectedRoute` guards.

### Stage 7: Side-by-Side Automated Testing (`frontend/src/features/<feature>/__tests__/`)
- **MANDATORY**: Create unit and component integration tests using **Vitest** and **React Testing Library**:
  - Test initial render, empty states, and skeleton states.
  - Test user interactions (button clicks, form inputs, validation errors).
  - Test hook/mutation behavior with mocked API responses.
- File naming: `<Component>.test.tsx` or `<hook>.test.ts`.

### Stage 8: Build & Test Verification
- Run `npm run test:frontend` — all test suites must pass.
- Run `npm run build:frontend` — zero TypeScript and Vite bundling errors.
- Update `FEATURE_TRACKER.md`, `FRONTEND_FEATURES.md`, and `.agents/context/FEATURE_LOG.md`.
