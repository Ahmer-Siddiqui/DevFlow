# Rule 07: Node.js, Redis & Concurrency Performance Standards

## ⚡ 1. Event Loop Protection
- **No Synchronous CPU-Intensive Work:** Never perform heavy calculations, blocking regex, or synchronous cryptographic work in the Express main thread.
- **Asynchronous I/O:** Always use `async/await` with properly pooled database connections and non-blocking file streaming.

---

## 🏎️ 2. Redis Caching Strategy

### Cache-Aside Pattern
1. Check Redis for cached entity or query:
   ```typescript
   const cached = await redisClient.get(`cache:project:${projectId}`);
   if (cached) return JSON.parse(cached);
   ```
2. If cache miss, fetch from PostgreSQL database.
3. Write back to Redis with a strict Time-To-Live (TTL):
   ```typescript
   await redisClient.setex(`cache:project:${projectId}`, 300, JSON.stringify(project));
   ```

### Cache Invalidation on Mutations
Whenever a project or task is updated or deleted, immediately invalidate or delete the related cache keys:
```typescript
await redisClient.del(`cache:project:${projectId}`);
```

---

## 📬 3. BullMQ Job Queuing Standard

- **Decouple Heavy Side-Effects:** Sending emails, generating PDF summaries, processing `@mentions`, and fanout notifications MUST NOT block HTTP request handlers.
- **Job Submission:** Push jobs onto dedicated BullMQ queues:
  ```typescript
  await notificationQueue.add('send-mention-notification', { taskId, mentionedUserId, authorId });
  ```
- **Job Retries & Exponential Backoff:** All workers must configure exponential backoff (`attempts: 3, backoff: { type: 'exponential', delay: 2000 }`).

---

## 🌐 4. Socket.IO Distributed Adapter
- Use `@socket.io/redis-adapter` so multiple backend instances can broadcast events across nodes seamlessly.
- Scope broadcasts strictly to relevant tenant or project rooms:
  ```typescript
  io.to(`project:${projectId}`).emit('task:updated', { taskId, patch });
  ```
- Clean up listeners on client disconnect to prevent memory leaks.
