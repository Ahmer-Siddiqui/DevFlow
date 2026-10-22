# Rule 01: DevFlow Project Overview & Domain Specifications

## 🎯 1. Business Vision & System Objective
**DevFlow** is an enterprise-grade SaaS project management, issue tracking, and team collaboration platform tailored for modern engineering teams, product managers, and agile organizations (drawing inspiration from Jira, Linear, and ClickUp).

---

## 🏢 2. Domain Entities & Core Modules

### 1. Multi-Tenancy & Organizations
- **Organization (`organizations`):** The master tenant boundary. All data (projects, tasks, comments, files) belongs to an Organization.
- **Organization Membership (`organization_members`):** Maps users to organizations with RBAC roles (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).
- **User (`users`):** Global identity containing email, password hash, avatar, profile data, and verification status.

### 2. Workspaces & Projects
- **Project (`projects`):** Belongs to an Organization. Contains unique project key (e.g. `DEV`, `PROD`), name, description, lead user, and workflow status definitions.
- **Project Membership (`project_members`):** Defines user access and permissions within specific projects.

### 3. Tasks & Kanban Engine
- **Task (`tasks`):** Core work item with title, markdown description, type (`BUG`, `FEATURE`, `IMPROVEMENT`), status (`BACKLOG`, `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), due date, story points, and `order` (floating-point position for Kanban reordering).
- **Subtasks & Checklists:** Hierarchical parent-child task support.
- **Assignees & Watchers:** Multi-user assignment and notification subscriptions.

### 4. Collaboration & Comments Engine
- **Comment (`comments`):** Rich text discussion on tasks with threaded replies.
- **User Mentions (`@username`):** Real-time mention detection triggering in-app and background email notifications.
- **Activity Feed & Audit Log (`audit_logs`):** Immutable record capturing `who`, `what`, `when`, and `diff` of changes.

### 5. Real-Time & Event Architecture
- **Socket.IO Rooms:** Tenant and project-scoped socket rooms (`org:<orgId>`, `project:<projectId>`).
- **Real-Time Events:** Live drag-and-drop board sync, typing indicators, active viewer avatars, and live task updates.
- **Redis Pub/Sub:** Distributed horizontal scaling of WebSocket traffic.

### 6. Background Processing & Caching
- **Redis Cache:** Hot project metadata, active session cache, and rate limiting counters.
- **BullMQ Workers:** Asynchronous email dispatch, webhook triggers, audit log aggregation, and report generation.

---

## 📐 3. Tenant Isolation Guardrail
Every query involving organizational assets must have an explicit tenant filter:
```typescript
where: {
  id: taskId,
  organizationId: currentUser.organizationId
}
```
**Never allow cross-tenant data access.** Any request failing tenant validation must return `403 Forbidden` or `404 Not Found`.
