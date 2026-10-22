# Rule 10: Production-Grade Testing Standards (Continuous Side-by-Side Testing)

## 🎯 Mandatory Rule
**No feature is considered "Done" without its corresponding automated test suite.** Every PR, endpoint, or UI component must be delivered alongside its tests.

---

## 🧪 1. Monorepo Test Commands

| Command | Action | Scope |
| :--- | :--- | :--- |
| `npm test` | Runs both backend Jest and frontend Vitest suites | Monorepo |
| `npm run test:backend` | Runs Jest integration & unit tests | `backend` |
| `npm run test:frontend` | Runs Vitest component & hook tests | `frontend` |

---

## ⚙️ 2. Backend Testing Standards (Jest & Supertest)

### Structure (`backend/tests/`)
- `tests/unit/`: Test services, repositories, validators, and utility functions in isolation with mocks.
- `tests/integration/`: Test HTTP endpoints end-to-end via Supertest against database and express routes.

### Mandatory Test Coverage for Every Endpoint:
1. **Happy Path:** Valid input returns 200/201 with standardized JSON envelope.
2. **Validation Failure:** Invalid body/params returns 400 with Zod error breakdown.
3. **Authentication Failure:** Missing/expired token returns 401 Unauthorized.
4. **Tenant Isolation:** Cross-tenant request returns 403 Forbidden or 404 Not Found.
5. **RBAC Authorization:** Insufficient role (e.g. VIEWER attempting DELETE) returns 403 Forbidden.

---

## 🎨 3. Frontend Testing Standards (Vitest & React Testing Library)

### Structure (`frontend/src/features/<feature>/__tests__/`)
- Component Tests: Render presentational components in `jsdom`, verify text, inputs, buttons, and accessibility roles.
- Hook Tests: Test custom React hooks with `renderHook` from `@testing-library/react`.

### Mandatory Test Coverage for Every UI Feature:
1. **Initial Rendering:** Component mounts cleanly without runtime exceptions.
2. **States Coverage:** Loading skeletons, error alert, and empty collection states are tested.
3. **User Interaction:** Form submission, button clicks, and input typing trigger expected handlers.
4. **Optimistic Updates:** Verify UI reflects state changes immediately before server response resolves.
