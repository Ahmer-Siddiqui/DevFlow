# Rule 02: Backend Architecture & Implementation Standards

## 🏛️ 1. Pragmatic 4-Layer Architecture

The DevFlow backend enforces strict unidirectional layering:

```
[ HTTP Requests / Sockets ]
            │
            ▼
[ Routes & Middlewares ] ────► Auth, TenantContext, RBAC, Zod Validation
            │
            ▼
[ Controllers ] ─────────────► HTTP / Transport handling, status codes, DTO passing
            │
            ▼
[ Services ] ────────────────► Business logic, Transactions, Socket emits, Jobs
            │
            ▼
[ Repositories ] ────────────► TypeORM database queries, Tenant WHERE filters
            │
            ▼
[ Entities & Database ] ─────► PostgreSQL Schema (Supabase)
```

---

## 🛑 2. Architectural Layer Invariants

### 1. Controllers (`src/controllers/`)
- Extract validated parameters, query strings, and body payloads from `req`.
- Delegate all logic immediately to Services.
- Return standardized JSON responses using `res.status(code).json({ success: true, data })`.
- **FORBIDDEN:** Controllers MUST NEVER call TypeORM `Repository` or `EntityManager` directly.

### 2. Services (`src/services/`)
- Encapsulate business rules, validation workflows, and transaction boundaries.
- Inject repositories via constructor or composition root.
- Throw custom `AppError(message, statusCode)` when business rules fail.
- Emit real-time events via `SocketService` and dispatch background jobs via `BullMQ queues`.
- **FORBIDDEN:** Services MUST NEVER access HTTP `req` or `res` objects directly.

### 3. Repositories (`src/repositories/`)
- Dedicated data-access classes encapsulating TypeORM `Repository<T>` logic.
- Interfaces declared in `src/core/IRepositories/` for testability and loose coupling.
- Enforce tenant isolation automatically on all tenant-scoped queries.
- **FORBIDDEN:** Repositories MUST NEVER contain business rules or emit socket events.

### 4. Middlewares (`src/middlewares/`)
- `authenticate`: Verifies JWT access token, populates `req.user`.
- `requireRole([...roles])`: Enforces role-based permissions (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
- `tenantContext`: Extracts and verifies `organizationId` from headers/tokens/params.
- `validate(schema)`: Validates body, query, and params against Zod schemas.
- `errorHandler`: Global catch-all transforming errors into standardized JSON formats with appropriate HTTP status codes.

---

## 📦 3. Error Handling Standard
Use a structured application error class:
```typescript
export class AppError extends Error {
  constructor(
    public override readonly message: string,
    public readonly statusCode: number = 400,
    public readonly errors: any = null
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
```

Standardized API response format:
```json
{
  "success": false,
  "message": "Resource not found or unauthorized",
  "errors": null
}
```
