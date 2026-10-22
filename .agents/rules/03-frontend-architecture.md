# Rule 03: Frontend Architecture & Client Standards

## 🏛️ 1. Feature-First Modular Structure

DevFlow Frontend organizes code around business domains rather than purely technical roles:

```
frontend/src/
├── assets/          # Static logos, illustrations, brand media
├── components/      # Global atomic UI primitives (Button, Modal, Input, Badge, Dropdown, Skeleton)
├── config/          # Environment variables, API constants, socket URLs
├── context/         # Cross-app React contexts (ThemeContext, SocketContext)
├── features/        # Business feature modules
│   ├── auth/        # Login, Register, Invite, Session check
│   ├── orgs/        # Organization switcher, settings, members
│   ├── projects/    # Project list, creation, settings
│   ├── tasks/       # Task modal, detail view, subtasks, comments
│   ├── kanban/      # dnd-kit Kanban board, columns, reordering
│   ├── realtime/    # Live collaboration hooks, presence avatars
│   └── analytics/   # Recharts sprint velocity, workload charts
│       ├── api/         # Axios API endpoints & TanStack Query hooks
│       ├── components/  # Feature-specific presentational components
│       ├── hooks/       # Custom React hooks encapsulating business logic
│       ├── stores/      # Zustand store slices (UI state only)
│       └── types/       # Domain-specific TypeScript models & DTOs
├── layouts/         # Shared screen shells (AuthLayout, DashboardLayout, ProjectLayout)
├── lib/             # Axios client, queryClient, socket singleton, utils (`cn`)
├── pages/           # Routed view containers
└── routes/          # App router configuration, ProtectedRoute guards
```

---

## ⚡ 2. State Management Rules

1. **Server State ➔ TanStack Query v5:**
   - All asynchronous data fetching, caching, deduplication, invalidation, and optimistic mutations belong in TanStack Query.
   - Use custom query hooks (`useTasksQuery`, `useProjectQuery`) and mutation hooks (`useUpdateTaskStatusMutation`).
   - Query keys must follow standardized hierarchical array structures: `['projects', projectId, 'tasks']`.

2. **Client UI State ➔ Zustand:**
   - Ephemeral UI state (e.g. sidebar collapsed, active filter modal open, selected task ID, active drag item) belongs in Zustand.
   - Keep Zustand stores atomic and feature-scoped (`useKanbanStore`, `useAuthStore`).

---

## 🎯 3. Kanban Drag-and-Drop Standard (`@dnd-kit`)

- Use `@dnd-kit/core` with `PointerSensor` and `KeyboardSensor` (with activation constraints `distance: 5` to prevent accidental clicks).
- Use `SortableContext` with `verticalListSortingStrategy` per column.
- **Optimistic State Updates:** When a task is dragged between columns or reordered, instantly update local cache state via `queryClient.setQueryData`, then send the API patch request in the background. If the request fails, roll back smoothly.
- Compute new `order` using fractional ordering (e.g., between item A and item B: `(orderA + orderB) / 2`) to avoid massive batch re-indexing on every drag.

---

## 🛡️ 4. Form Validation & Typing

- Define validation schemas using Zod.
- Use `react-hook-form` coupled with `@hookform/resolvers/zod`.
- Strict typing: Never use `any`. Always infer types directly from Zod schemas:
  ```typescript
  export type CreateTaskInput = z.infer<typeof createTaskSchema>;
  ```

---

## 🎨 5. UI/UX Standards

- **Zero Layout Shifts (CLS):** Use skeleton loaders that mirror actual card and table layouts.
- **Micro-Interactions:** Subtle transitions on hover, focus, drag overlays, and badge state changes.
- **Responsive Resilience:** Mobile responsive sidebar drawer, adaptive Kanban horizontal scroll, and responsive modal dialogues.
