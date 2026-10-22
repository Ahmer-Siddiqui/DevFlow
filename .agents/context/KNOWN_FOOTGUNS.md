# Known Footguns & Gotchas (DevFlow)

Review this document before building new features to avoid recurring pitfalls.

---

## 1. Multi-Tenant Query Leaks
- **Gotcha:** Calling `taskRepo.findOneBy({ id })` without checking `organizationId`.
- **Consequence:** A user from Tenant A could view or mutate Tenant B's tasks by guessing UUIDs.
- **Rule:** Always enforce `where: { id, organizationId: req.user.organizationId }`.

---

## 2. dnd-kit Click vs Drag Conflict
- **Gotcha:** Clicking a task card to open the detail modal accidentally initiates a drag event.
- **Fix:** Configure `PointerSensor` activation constraint:
  ```typescript
  activationConstraint: { distance: 8 }
  ```

---

## 3. BullMQ & Redis In-Memory Overuse
- **Gotcha:** Storing huge JSON blobs or file buffers directly in job payloads.
- **Fix:** Only pass entity IDs (`taskId`, `userId`) in job payloads. Let the worker fetch fresh data from the database.

---

## 4. Socket Room Cleanup
- **Gotcha:** Emitting socket events to `io.emit()` (global) instead of `io.to('project:' + id).emit()`.
- **Consequence:** Leaks live task movements across different tenants and projects.
