# Rule 09: React Performance & Rendering Standards

## 🏎️ 1. Kanban Board & Drag-and-Drop Performance

In an interactive Kanban board with hundreds of tasks, unoptimized re-renders can cause noticeable drag stutter:

1. **Memoize Task Cards (`TaskCard.tsx`):**
   ```tsx
   export const TaskCard = React.memo(TaskCardComponent, (prev, next) => {
     return prev.task.id === next.task.id &&
            prev.task.status === next.task.status &&
            prev.task.order === next.task.order &&
            prev.task.updatedAt === next.task.updatedAt;
   });
   ```

2. **Pointer Sensors with Drag Delay:**
   Always specify activation constraints to distinguish between task card clicks (opening detail modal) and drags:
   ```tsx
   const sensors = useSensors(
     useSensor(PointerSensor, {
       activationConstraint: {
         distance: 8,
       },
     })
   );
   ```

3. **Lightweight Drag Overlay:**
   During dragging, render a simplified visual clone in `DragOverlay` rather than re-rendering full sub-trees.

---

## ⚡ 2. TanStack Query & Socket Sync Optimization

- **Selective Invalidation:** When a WebSocket event announces `task:updated`, update the specific task directly in cache using `queryClient.setQueryData`, rather than triggering full board refetches:
  ```typescript
  queryClient.setQueryData(['projects', projectId, 'tasks'], (old: Task[] | undefined) => {
    if (!old) return [];
    return old.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t);
  });
  ```

---

## 🎯 3. Code Splitting & Route Lazy Loading
Every main top-level page must be lazy-loaded:
```tsx
const KanbanPage = React.lazy(() => import('@/pages/KanbanPage'));
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
```
Wrap routes in `<Suspense fallback={<PageSkeleton />}>`.
