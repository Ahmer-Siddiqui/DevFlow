# Rule 06: Verification & Quality Gates

## 🎯 Purpose
To guarantee that no broken code, insecure pattern, or unverified feature ever enters the DevFlow codebase.

---

## 🚦 The 6 Quality Gates

Before declaring any feature or refactor complete, the solution must pass all 6 gates:

### Gate 1: Type Safety & Compilation
- `npm run build:backend` must exit with code 0 (zero errors).
- `npm run build:frontend` must pass `tsc -b` and `vite build`.
- Zero usage of `any`. Explicit interfaces for DTOs, parameters, and query results.

### Gate 2: Boundary Validation
- All backend routes must validate `body`, `params`, and `query` using Zod schemas.
- All frontend forms must validate inputs before submission using React Hook Form + Zod.

### Gate 3: Strict Tenant Isolation & Security
- Every repository query accessing organization-specific data must include `where: { organizationId }`.
- Role-based authorization (`requireRole`) must protect administrative endpoints.
- Password hashing must use Bcrypt with min 10 rounds.
- JWT secret keys must never be hardcoded.

### Gate 4: Structured Error Handling
- Never throw plain strings or generic `Error`. Use `AppError(message, statusCode, errors)`.
- Global error handler must capture unexpected exceptions and avoid leaking internal database stack traces to clients.

### Gate 5: Kanban & UI Experience
- Drag-and-drop operations must update optimistically with rollback on failure.
- Every async view must show skeleton loaders on initial load, empty states when collections are empty, and friendly error banners on failure.

### Gate 6: Regression & Smoke Verification
- Verify newly added endpoints with integration tests or manual API execution.
- Check that previous features remain functional without broken imports or circular dependencies.
