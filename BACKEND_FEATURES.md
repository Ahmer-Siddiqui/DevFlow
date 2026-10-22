# DEVFLOW — Backend Feature & Implementation Checklist

> **Stack:** Node.js | Express.js | TypeScript | TypeORM | PostgreSQL (Supabase) | Redis | BullMQ | Socket.IO | Zod | Jest | Supertest  
> **Pattern:** Pragmatic Layered Architecture (Middleware → Controller → Service → TypeORM Repository)

---

## 🏗️ Phase 01: Project Foundation & Architecture

- [x] **TypeScript & Node Setup**
  - [x] Initialize `package.json` with strict scripts (`dev`, `build`, `start`, `test`)
  - [x] Configure `tsconfig.json` (strict mode, decorators enabled for TypeORM: `experimentalDecorators`, `emitDecoratorMetadata`)
  - [x] Setup `ts-node-dev` for fast development hot-reloading
- [x] **Environment Configuration (Zod Validated)**
  - [x] Create `src/config/env.ts` with strict schema validation
  - [x] Define `.env.example` with all configuration keys
- [x] **Database & TypeORM Setup**
  - [x] Configure `src/config/data-source.ts` with connection pooling for Supabase/PostgreSQL
  - [x] Implement database connection lifecycle and graceful shutdown hooks
- [x] **Redis Setup**
  - [x] Configure `src/config/redis.ts` using `ioredis`
  - [x] Implement Redis ping health check on server startup
- [x] **Structured Logging & Diagnostics**
  - [x] Setup Winston structured logger (`src/config/logger.ts`) with correlation IDs
  - [x] Implement `X-Request-ID` correlation middleware
- [x] **Error Handling & Response Architecture**
  - [x] Build custom `ApiError` class with HTTP status codes and operational flags
  - [x] Create standardized `ApiResponse` helper (`{ success: true, data: ..., meta: ... }`)
  - [x] Implement centralized global error middleware (`error.middleware.ts`)
- [x] **Zod Request Validation Middleware**
  - [x] Generic validation middleware supporting `body`, `query`, and `params`

---

## 🔐 Phase 02: Authentication & Session Management

- [ ] **Database Entities**
  - [ ] `User.entity.ts` (`id`, `email`, `passwordHash`, `name`, `avatar`, `isEmailVerified`, `createdAt`)
  - [ ] `Session.entity.ts` (`id`, `userId`, `refreshTokenHash`, `userAgent`, `ipAddress`, `expiresAt`)
- [ ] **Security Utilities**
  - [ ] Password hashing & comparison utility using `bcrypt`
  - [ ] JWT sign/verify service (`TokenService`) for short-lived Access Tokens (15m) and long-lived Refresh Tokens (7d)
- [ ] **Auth Endpoints & Service Logic**
  - [ ] `POST /api/v1/auth/register` (Validate email, hash password, create user, trigger verification)
  - [ ] `POST /api/v1/auth/login` (Verify credentials, issue tokens, set secure HttpOnly cookie)
  - [ ] `POST /api/v1/auth/refresh-token` (Validate refresh token, rotate token, update session)
  - [ ] `POST /api/v1/auth/logout` (Revoke session, clear HttpOnly cookie)
  - [ ] `GET /api/v1/auth/me` (Return current authenticated user)
  - [ ] `POST /api/v1/auth/forgot-password` (Generate timed reset token, queue email)
  - [ ] `POST /api/v1/auth/reset-password` (Validate token, update password, invalidate all sessions)
  - [ ] `POST /api/v1/auth/verify-email` (Confirm user email address)
  - [ ] `PATCH /api/v1/auth/change-password` (Verify old password, update to new)
- [ ] **Authentication Middleware**
  - [ ] `auth.middleware.ts` (Verify Bearer token or cookie, attach `req.user`)

---

## 🏢 Phase 03: Organizations & Multi-Tenant RBAC

- [ ] **Database Entities**
  - [ ] `Organization.entity.ts` (`id`, `name`, `slug`, `ownerId`, `logoUrl`, timestamps)
  - [ ] `OrganizationMember.entity.ts` (`id`, `organizationId`, `userId`, `role`, timestamps)
  - [ ] Define unique compound index on `(organizationId, userId)`
- [ ] **Role & Permission Definitions**
  - [ ] Define roles enum: `OWNER`, `ADMIN`, `MANAGER`, `MEMBER`
  - [ ] Create permission matrix (`src/constants/permissions.ts`)
- [ ] **Tenancy & RBAC Middlewares**
  - [ ] `tenant.middleware.ts` (Extract `organizationId` or slug, verify caller is a valid member, attach `req.organization` & `req.membership`)
  - [ ] `rbac.middleware.ts` (`requirePermission(Permission.PROJECT_CREATE)`)
- [ ] **Organization Endpoints**
  - [ ] `POST /api/v1/organizations` (Create organization, assign creator as OWNER)
  - [ ] `GET /api/v1/organizations` (List organizations the current user belongs to)
  - [ ] `GET /api/v1/organizations/:orgId` (Retrieve active organization details)
  - [ ] `PATCH /api/v1/organizations/:orgId` (Update organization settings)
  - [ ] `DELETE /api/v1/organizations/:orgId` (Delete organization - OWNER only)
  - [ ] `GET /api/v1/organizations/:orgId/members` (List members with roles)
  - [ ] `POST /api/v1/organizations/:orgId/members/invite` (Send invite to email with assigned role)
  - [ ] `PATCH /api/v1/organizations/:orgId/members/:memberId/role` (Update member role)
  - [ ] `DELETE /api/v1/organizations/:orgId/members/:memberId` (Remove member from organization)

---

## 📁 Phase 04: Project Management Module

- [ ] **Database Entities**
  - [ ] `Project.entity.ts` (`id`, `organizationId`, `name`, `key`, `description`, `ownerId`, `status`, `startDate`, `dueDate`)
  - [ ] `ProjectMember.entity.ts` (`id`, `projectId`, `userId`, `role`)
  - [ ] Unique compound index on `(organizationId, key)` (e.g. "DEV", "ALPHA")
- [ ] **Project Endpoints & Logic**
  - [ ] `POST /api/v1/projects` (Create project, auto-generate unique key, add creator to members)
  - [ ] `GET /api/v1/projects` (List projects for current organization with member/task counts)
  - [ ] `GET /api/v1/projects/:projectId` (Get project details & member list)
  - [ ] `PATCH /api/v1/projects/:projectId` (Update project details)
  - [ ] `DELETE /api/v1/projects/:projectId` (Archive/delete project)
  - [ ] `POST /api/v1/projects/:projectId/members` (Add user to project)
  - [ ] `DELETE /api/v1/projects/:projectId/members/:userId` (Remove user from project)

---

## 📝 Phase 05: Task Management & Filtering

- [ ] **Database Entities**
  - [ ] `Task.entity.ts` (`id`, `projectId`, `organizationId`, `taskNumber`, `title`, `description`, `status`, `priority`, `order`, `dueDate`, `assignedToId`, `createdById`, `labels`, `watchers`)
  - [ ] Enums: Status (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`), Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
  - [ ] Indexes for fast queries: `(projectId, status, order)` and `(organizationId, assignedToId)`
- [ ] **Task Endpoints & Logic**
  - [ ] `POST /api/v1/tasks` (Create task, auto-increment task number within project, set initial order)
  - [ ] `GET /api/v1/tasks` (Paginated list with search, status, priority, assignee, and label filters)
  - [ ] `GET /api/v1/tasks/:taskId` (Fetch task with assignees, watchers, and attachments)
  - [ ] `PATCH /api/v1/tasks/:taskId` (Update title, description, priority, dates, assignees)
  - [ ] `DELETE /api/v1/tasks/:taskId` (Delete task and trigger cleanups)
  - [ ] `POST /api/v1/tasks/:taskId/watchers` (Add/remove watcher)

---

## 📋 Phase 06: Kanban Board Engine

- [ ] **Order Indexing & Movement Logic**
  - [ ] Implement fractional indexing or safe integer reordering algorithm
  - [ ] Service transaction to handle atomic column transitions
- [ ] **Kanban Endpoints**
  - [ ] `GET /api/v1/projects/:projectId/board` (Fetch tasks grouped by status columns, sorted by order)
  - [ ] `PATCH /api/v1/tasks/:taskId/move` (Update status and position index atomically)

---

## 💬 Phase 07: Comments & Mentions

- [ ] **Database Entities**
  - [ ] `Comment.entity.ts` (`id`, `taskId`, `authorId`, `content`, `mentions`, `createdAt`, `updatedAt`)
- [ ] **Endpoints & Logic**
  - [ ] `POST /api/v1/tasks/:taskId/comments` (Add comment, parse `@username` mentions)
  - [ ] `GET /api/v1/tasks/:taskId/comments` (List comments with author details)
  - [ ] `PATCH /api/v1/comments/:commentId` (Edit comment - author only)
  - [ ] `DELETE /api/v1/comments/:commentId` (Delete comment - author or admin)
  - [ ] Dispatch notification to mentioned users

---

## ⚡ Phase 08: Real-time Socket.IO Engine

- [ ] **Socket Server Architecture**
  - [ ] Initialize Socket.IO with Redis Adapter (`@socket.io/redis-adapter`)
  - [ ] JWT authentication handshake middleware for WebSocket connections
- [ ] **Scoped Rooms Implementation**
  - [ ] `org:{orgId}` (Tenant-wide alerts)
  - [ ] `project:{projectId}` (Kanban board live updates)
  - [ ] `task:{taskId}` (Task modal live comments & typing)
- [ ] **Events Dispatching**
  - [ ] Emit `task:created`, `task:moved`, `task:updated`, `task:deleted`
  - [ ] Emit `comment:added`
  - [ ] User presence & typing indicators (`user:typing`, `user:online`, `user:offline`)

---

## 🔔 Phase 09: Notifications System

- [ ] **Database Entities**
  - [ ] `Notification.entity.ts` (`id`, `recipientId`, `organizationId`, `type`, `isRead`, `payload`, `createdAt`)
- [ ] **Notification Types Handled**
  - [ ] `TASK_ASSIGNED`, `TASK_MENTION`, `TASK_UPDATED`, `COMMENT_ADDED`, `PROJECT_INVITATION`, `DEADLINE_REMINDER`
- [ ] **Endpoints & Logic**
  - [ ] `GET /api/v1/notifications` (List user notifications with pagination)
  - [ ] `GET /api/v1/notifications/unread-count` (Get total unread badges)
  - [ ] `PATCH /api/v1/notifications/:id/read` (Mark specific notification as read)
  - [ ] `PATCH /api/v1/notifications/read-all` (Mark all notifications as read)
  - [ ] Push real-time notification to user's private socket room

---

## 📜 Phase 10: Immutable Audit Logs

- [ ] **Database Entities**
  - [ ] `AuditLog.entity.ts` (`id`, `organizationId`, `actorId`, `action`, `resourceType`, `resourceId`, `metadata`, `createdAt`)
- [ ] **Audit Dispatcher Service**
  - [ ] Immutable event recorder for all key domain events
  - [ ] Asynchronous event capture (non-blocking for main request thread)
- [ ] **Endpoints**
  - [ ] `GET /api/v1/organizations/:orgId/audit-logs` (Paginated activity trail with filters)

---

## 📎 Phase 11: File Storage Provider

- [ ] **Storage Abstraction Pattern**
  - [ ] Create `IStorageService` interface (`uploadFile`, `deleteFile`, `getFileUrl`)
  - [ ] Implement `LocalStorageService` (Local disk storage for development)
  - [ ] Implement `CloudStorageService` (Supabase Storage / S3 driver for production)
  - [ ] Dynamic driver resolution based on `STORAGE_PROVIDER` environment variable
- [ ] **Attachment Entities & Endpoints**
  - [ ] `Attachment.entity.ts` (`id`, `taskId`, `uploadedById`, `filename`, `fileKey`, `mimeType`, `sizeBytes`, `url`)
  - [ ] `POST /api/v1/tasks/:taskId/attachments` (Multer file validation: max size 10MB, allowed MIME types)
  - [ ] `DELETE /api/v1/attachments/:attachmentId` (Remove file from storage and database)

---

## ⏱️ Phase 12: Redis Caching & BullMQ Background Jobs

- [ ] **BullMQ Queues Setup**
  - [ ] `email.queue.ts` (Transactional emails: verification, invite, password reset)
  - [ ] `reminder.queue.ts` (Task deadline alerts)
- [ ] **Workers Implementation**
  - [ ] Email worker with pluggable email provider
  - [ ] Cron schedule worker: Scan for tasks due in 24 hours, generate notifications and dispatch reminder emails
- [ ] **Redis Production Cache**
  - [ ] Cache project metadata & user permissions with TTL
  - [ ] Implement Cache-Aside and Invalidation on update

---

## 📊 Phase 13: Dashboard Analytics

- [ ] **Analytics Service Aggregations**
  - [ ] Project status counts (Active, Completed, Overdue)
  - [ ] Task distribution by Status & Priority
  - [ ] Tasks completed per week (Velocity metric)
  - [ ] Member productivity (Assigned vs Completed tasks)
- [ ] **Endpoints**
  - [ ] `GET /api/v1/organizations/:orgId/dashboard` (Aggregate metrics in a single optimized payload)

---

## 🧪 Phase 14: Automated Testing

- [ ] **Test Setup**
  - [ ] Jest + `ts-jest` + Supertest configuration
  - [ ] Test database connection setup and rollback helpers
- [ ] **Unit Tests**
  - [ ] `TokenService` (sign, verify, decode, expire)
  - [ ] `RbacService` (Permission matrix resolution)
  - [ ] `TaskService` (Status transition rules)
- [ ] **Integration Tests**
  - [ ] Complete Auth flow (Register → Login → Refresh → Logout)
  - [ ] Organization creation and member role transitions
  - [ ] 🚨 **CRITICAL TENANT ISOLATION TEST**:
    - [ ] Verify User in Org A gets `403 Forbidden` or `404 Not Found` when requesting Org B's project or task

---

## 📖 Phase 15: Swagger / OpenAPI Documentation

- [ ] Setup `swagger-ui-express` and `swagger-jsdoc` at `/api/docs`
- [ ] Document all authentication endpoints and bearer security scheme
- [ ] Document Organizations, Projects, Tasks, and Comments endpoints
- [ ] Include request schemas, parameter types, and example error payloads

---

## 🐳 Phase 16: Docker & Infrastructure

- [ ] Multi-stage production `Dockerfile` for Node.js backend
- [ ] `docker-compose.yml` orchestrating API, Redis, and health checks
- [ ] Non-root user configuration inside production container

---

## 🚀 Phase 17: Production Readiness

- [ ] Graceful shutdown handler (`SIGTERM`, `SIGINT` handling database & Redis disconnects)
- [ ] Health check endpoint (`GET /health`) checking DB and Redis statuses
- [ ] Environment production checklist verification

---

## 🛡️ Phase 18: Security & Performance Audit

- [ ] Helmet security headers configured
- [ ] Strict CORS policy configuration
- [ ] Rate limiting on sensitive endpoints (`/auth/login`, `/auth/register`)
- [ ] SQL Injection resistance verified via parameterized TypeORM queries
- [ ] Verify compound database indexes in PostgreSQL schema
