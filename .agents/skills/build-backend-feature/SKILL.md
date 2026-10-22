---
name: build-backend-feature
description: "Procedural, end-to-end playbook for implementing any backend module or feature in DevFlow with mandatory side-by-side automated test suites. Enforces the complete 10-stage pipeline from Entity, Migration, Interfaces, Repositories, Services, Controllers, Zod Validators, Express Routes, Jest/Supertest test suites, and closed-loop verification."
metadata:
  author: devflow-architect
  version: "1.1.0"
---

# Build Backend Feature Playbook (DevFlow Pipeline)

Use this skill whenever instructed to build, implement, or expand any domain feature, resource, or endpoint in DevFlow Backend. Every feature MUST include side-by-side automated test cases.

---

## 🎯 Pre-Flight Checklist
Before writing code:
1. Read the relevant phase in [`BACKEND_FEATURES.md`](file:///d:/Backend%20Portfolio/DevFlow/BACKEND_FEATURES.md) and [`FEATURE_TRACKER.md`](file:///d:/Backend%20Portfolio/DevFlow/FEATURE_TRACKER.md).
2. Check `.agents/rules/02-backend-architecture.md` and `.agents/rules/08-postgresql-typeorm-database-performance.md`.
3. Confirm multi-tenancy requirements (`organizationId` isolation).

---

## 🏗️ The 10-Stage Backend Execution Workflow

### Stage 1: Entity Definition (`backend/src/entities/`)
- Create `backend/src/entities/<name>.entity.ts`.
- Inherit from `BaseTenantEntity` (or `BaseEntity`).
- Define column types, default values, and TypeORM relations (`@ManyToOne`, `@OneToMany`).
- Add composite indexes: `@Index(['organizationId', ...])`.

### Stage 2: Database Data Source Registration (`backend/src/config/data-source.ts`)
- Import and register the entity in `AppDataSource.options.entities`.

### Stage 3: Repository Contract (`backend/src/core/IRepositories/`)
- Define `I<Name>Repository.ts` declaring data access methods.
- Enforce `organizationId` parameter on tenant queries.

### Stage 4: Repository Implementation (`backend/src/repositories/`)
- Implement `backend/src/repositories/<name>.repository.ts`.
- Use TypeORM `Repository` or `QueryBuilder`.

### Stage 5: Service Contract (`backend/src/core/IServices/`)
- Define `I<Name>Service.ts` declaring business operations and return types.

### Stage 6: Service Implementation (`backend/src/services/`)
- Implement `backend/src/services/<name>.service.ts`.
- Inject repositories. Enforce business rules. Throw `AppError` on violations.
- Emit socket events or enqueue BullMQ jobs if side-effects are required.

### Stage 7: Zod Validation Schemas (`backend/src/validators/`)
- Create `backend/src/validators/<name>.validator.ts`.
- Define schemas for `body`, `query`, and `params`.

### Stage 8: Controller & Routes (`backend/src/controllers/`, `backend/src/routes/`)
- Implement `backend/src/controllers/<name>.controller.ts` (transport layer only).
- Wire endpoints in `backend/src/routes/<name>.routes.ts`.
- Apply `authenticate`, `requireRole`, `tenantContext`, and `validate(schema)`.
- Mount routes in `backend/src/app.ts`.

### Stage 9: Side-by-Side Automated Testing (`backend/tests/`)
- **MANDATORY**: Create unit and integration test suites:
  - `tests/unit/<name>.service.test.ts`: Test business logic edge cases, validation errors, and mocked repositories.
  - `tests/integration/<name>.routes.test.ts`: Test HTTP endpoint status codes (200, 201, 400, 401, 403, 404) with Supertest.
  - Assert multi-tenant isolation: Verify Tenant B cannot access Tenant A's records.

### Stage 10: Closed-Loop Verification
- Run `npm run test:backend` — all tests must pass.
- Run `npm run build:backend` to confirm zero TypeScript compilation errors.
- Sync progress in `FEATURE_TRACKER.md`, `BACKEND_FEATURES.md`, and `.agents/context/FEATURE_LOG.md`.
