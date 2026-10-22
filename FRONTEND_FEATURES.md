# DEVFLOW — Frontend Feature & Implementation Checklist

> **Stack:** React 18+ | TypeScript | Vite | Tailwind CSS | shadcn/ui style primitives | React Router | TanStack Query | Zustand | React Hook Form | Zod | Axios | Socket.IO Client | dnd-kit | Recharts  
> **Design Aesthetics:** Modern Dark/Light SaaS | Sleek Typography | Glassmorphism Accents | Micro-interactions

---

## 🏗️ Phase 01: Frontend Foundation & Setup

- [x] **Vite + React + TypeScript Initialization**
  - [x] Initialize Vite project with strict TypeScript template (`tsconfig.json`)
  - [x] Configure path aliases (`@/` mapping to `src/`)
- [x] **Tailwind CSS & Design Tokens**
  - [x] Configure `tailwind.config.js` with cohesive dark/light mode palette
  - [x] Setup modern Google Fonts (Inter / Plus Jakarta Sans)
  - [x] Create `index.css` design system variables (HSL based tokens)
- [ ] **Base UI Primitives (shadcn/ui style)**
  - [ ] `Button.tsx` (variants: primary, secondary, outline, ghost, destructive, with loading spinners)
  - [ ] `Input.tsx`, `Textarea.tsx`, `Select.tsx`
  - [ ] `Dialog.tsx` (Modal window with backdrop blur)
  - [ ] `DropdownMenu.tsx`, `Popover.tsx`, `Tooltip.tsx`
  - [ ] `Badge.tsx` (status and priority color maps)
  - [ ] `Avatar.tsx` (with fallback initials and presence indicator ring)
- [ ] **Routing & Shell Layout**
  - [ ] Configure React Router v6 with code-splitting
  - [ ] `ProtectedRoute.tsx` (Redirect to `/login` if unauthenticated)
  - [ ] `AppLayout.tsx` (Collapsible Sidebar, Navbar, Breadcrumbs, Content Area)
  - [ ] `AuthLayout.tsx` (Branded split-screen layout for authentication pages)
- [x] **Core Infrastructure Libraries**
  - [x] Axios client with `baseURL`, credentials support, and 401 token refresh queue
  - [x] TanStack Query `QueryClientProvider` with sensible retry and stale-time defaults
  - [ ] Global Toast notifications system

---

## 🔐 Phase 02: Authentication UI & State

- [ ] **Zod Validation Schemas**
  - [ ] `loginSchema`, `registerSchema`, `forgotPasswordSchema`, `resetPasswordSchema`
- [ ] **Auth Pages**
  - [ ] `/login` (Email, password, "Remember me", forgot password link)
  - [ ] `/register` (Name, email, password strength indicator)
  - [ ] `/forgot-password` (Email input with success instructions state)
  - [ ] `/reset-password` (New password & confirmation with token from URL)
  - [ ] `/verify-email` (Automated verification on token detection)
- [ ] **State & Session Management**
  - [ ] `auth.store.ts` (Zustand: user profile, isAuthenticated flag, init check)
  - [ ] API hooks: `useLogin()`, `useRegister()`, `useLogout()`, `useCurrentUser()`
  - [ ] Seamless token refresh handling without page reload

---

## 🏢 Phase 03: Organization Switcher & Multi-Tenant UI

- [ ] **Organization Switcher Component**
  - [ ] Dropdown in Navbar displaying user's organizations
  - [ ] Switch active organization context stored in `organization.store.ts`
  - [ ] "Create New Organization" quick-action trigger
- [ ] **Organization Management Pages**
  - [ ] `/organizations` (List organizations user belongs to, with role badges)
  - [ ] Create Organization Modal (Name, Slug auto-generation, Logo upload)
  - [ ] `/settings/organization` (Update details, Danger Zone: Delete Org)
- [ ] **Team & Members UI (`/team`)**
  - [ ] Members table with search, role badges, and joined dates
  - [ ] "Invite Member" modal with email and role selector
  - [ ] Change role dropdown (OWNER/ADMIN only)
  - [ ] Remove member confirmation dialog
- [ ] **RBAC Permission Gate Component**
  - [ ] `<PermissionGate permission="PROJECT_CREATE">` wrapper for UI elements

---

## 📁 Phase 04: Project Management UI

- [ ] **Projects List (`/projects`)**
  - [ ] Grid and table view of projects with key badges (e.g. `[DEV]`)
  - [ ] Progress indicators (% tasks done)
  - [ ] Search and status filter (Active, Archived)
- [ ] **Create & Edit Project**
  - [ ] Create Project Modal (Name, Description, auto-generated Key, Dates)
  - [ ] Project Settings Page (`/projects/:projectId/settings`)
- [ ] **Project Team Allocation**
  - [ ] Add/remove members specifically from a project

---

## 📝 Phase 05: Task Management UI

- [ ] **Task List View**
  - [ ] Filter toolbar: Search, Status, Priority, Assignee, Due date range
  - [ ] Pagination controls with page size selector
  - [ ] Quick create inline task input
- [ ] **Task Detail Modal / Drawer (`/projects/:projectId/tasks/:taskId`)**
  - [ ] Title inline editable input
  - [ ] Rich description editor
  - [ ] Status dropdown selector (TODO, IN_PROGRESS, REVIEW, DONE)
  - [ ] Priority dropdown selector (LOW, MEDIUM, HIGH, URGENT)
  - [ ] Assignee picker with avatar previews
  - [ ] Due date calendar picker
  - [ ] Watchers list with "Watch" toggle button
  - [ ] Subtasks checklist with completion toggles

---

## 📋 Phase 06: Kanban Board (dnd-kit)

- [ ] **Kanban Board Layout (`/projects/:projectId/board`)**
  - [ ] 4-column responsive layout: TODO, IN_PROGRESS, REVIEW, DONE
  - [ ] Column header with task counter badges
  - [ ] Quick-add button at bottom of each column
- [ ] **Drag & Drop Interactions**
  - [ ] Integrated `DndContext`, `SortableContext`, and pointer sensors
  - [ ] `DragOverlay` showing floating card preview while dragging
  - [ ] Cross-column drag and drop transitions
  - [ ] Within-column reordering
- [ ] **Optimistic UI Engine**
  - [ ] Instant visual reorder before API responds
  - [ ] Automatic rollback with error toast if API call fails

---

## 💬 Phase 07: Task Comments & Mentions

- [ ] **Comments Thread Component**
  - [ ] Chronological comment list inside Task Detail modal
  - [ ] Relative timestamps (e.g., "5 minutes ago")
  - [ ] Edit and delete controls for author
- [ ] **Comment Input Box**
  - [ ] Markdown support (bold, italic, code blocks)
  - [ ] `@mention` autocomplete dropdown (shows team members when typing `@`)
  - [ ] Keyboard shortcut to submit (`Cmd/Ctrl + Enter`)

---

## ⚡ Phase 08: Real-time Socket.IO Integration

- [ ] **Socket Client Provider**
  - [ ] `useSocket()` hook with auto-reconnection logic
  - [ ] Connect with JWT authentication
- [ ] **Live Collaboration Features**
  - [ ] Join active project room on `/projects/:projectId/board`
  - [ ] Live Kanban updates: External user moves card → instant smooth animation on screen
  - [ ] Live comment updates: External user comments → instant addition to thread
  - [ ] Online presence indicator: Green dot on avatars of currently active users
  - [ ] Typing indicator in comments: *"Ahmed is typing..."*

---

## 🔔 Phase 09: Notification Center

- [ ] **Navbar Notification Bell**
  - [ ] Animated unread count badge
  - [ ] Popover dropdown showing recent notifications
- [ ] **Notifications Page (`/notifications`)**
  - [ ] Tabbed view: All vs Unread
  - [ ] "Mark all as read" action
  - [ ] Click-through navigation directly to the relevant task/project
  - [ ] Real-time incoming toast alert when a new notification arrives

---

## 📜 Phase 10: Audit Log Activity Feed

- [ ] **Audit Trail UI**
  - [ ] Activity tab inside Project view and Organization Settings
  - [ ] Formatted human-readable sentences (*"Sara moved DEV-42 to Done"*)
  - [ ] Actor avatar, timestamp, and diff metadata popover
  - [ ] Date range and action filters

---

## 📎 Phase 11: File Attachments UI

- [ ] **Upload Components**
  - [ ] Drag-and-drop file dropzone inside Task Detail modal
  - [ ] Client-side validation: Max 10MB, restricted file extensions
  - [ ] Upload progress bar
- [ ] **Attachments Grid**
  - [ ] Image previews, PDF badges, generic file icons
  - [ ] File metadata (file name, size, uploader, upload date)
  - [ ] Download file button
  - [ ] Delete attachment with confirmation

---

## 📊 Phase 13: Dashboard & Visualizations (Recharts)

- [ ] **Executive Metrics Strip**
  - [ ] Total Projects, Open Tasks, Completed Tasks, Overdue Tasks
- [ ] **Interactive Charts (Recharts)**
  - [ ] **Velocity Chart:** Tasks completed per week (Bar Chart)
  - [ ] **Status Distribution:** Donut / Pie Chart (TODO vs IN_PROGRESS vs REVIEW vs DONE)
  - [ ] **Priority Breakdown:** Stacked Bar Chart (Urgent, High, Medium, Low)
  - [ ] **Team Productivity:** Horizontal Bar Chart (Completed tasks per member)
- [ ] Date range selector filter for all charts (This Week, This Month, All Time)

---

## 🎨 Phase 15: UI Polish & User Experience

- [ ] **Empty States & Illustrations**
  - [ ] No projects found, No tasks in column, No notifications, No comments
- [ ] **Loading States**
  - [ ] Skeleton loaders for Kanban board, tables, and metric cards
  - [ ] Subtle top progress bar on route navigation
- [ ] **Error Boundaries & 404**
  - [ ] Custom 404 Not Found page with "Go Back Home" action
  - [ ] Component-level Error Boundary fallback with "Try Again" trigger
- [ ] **Accessibility (a11y)**
  - [ ] Keyboard navigation for modals, dropdowns, and Kanban cards

---

## 🐳 Phase 16: Frontend Containerization

- [ ] Production `Dockerfile` with multi-stage build (Node builder → Nginx Alpine runner)
- [ ] Custom `nginx.conf` handling React Router Single Page Application fallback (`try_files $uri /index.html`)

---

## 🚀 Phase 17: Production Optimization

- [ ] Code splitting with `React.lazy()` and `Suspense` for all major routes
- [ ] Optimized image assets and SVG icons
- [ ] Production bundle size verification (< 250kb initial chunk)
