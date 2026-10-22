# Rule 10: Production-Grade Testing Standards

## 🧪 1. Backend Testing Standards (Jest & Supertest)

### Structure
- Tests reside in `backend/tests/` matching module hierarchy:
  - `tests/unit/`: Testing services, utilities, and validators in isolation.
  - `tests/integration/`: Testing full HTTP pipeline from routes to database using Supertest.

### Tenant Isolation Verification Test Pattern
Every test suite must assert that Tenant B cannot access Tenant A's data:
```typescript
it('should reject access to tasks from another organization with 403 or 404', async () => {
  const tokenOrgB = generateTestToken({ userId: userB.id, orgId: orgB.id });
  
  const response = await request(app)
    .get(`/api/v1/projects/${projectA.id}/tasks/${taskA.id}`)
    .set('Authorization', `Bearer ${tokenOrgB}`);

  expect([403, 404]).toContain(response.status);
});
```

---

## 🎭 2. Mocking Guidelines

- **Redis Mocking:** Mock `ioredis` in unit tests using in-memory mock or `ioredis-mock`.
- **BullMQ Mocking:** Mock `.add()` methods on queues to assert jobs were enqueued with correct payloads without starting workers.
- **Socket.IO Mocking:** Stub `io.to().emit()` calls to verify notifications were broadcast.

---

## 🎨 3. Frontend Testing Standards

- Test critical user flows:
  - Login & Session persistence.
  - Adding a new task to Kanban.
  - Role-based UI visibility (e.g. viewers cannot see "Delete Project" button).
