# Rule 05: Automated Feature Tracking & Context Sync Protocol

## 🎯 Purpose
To prevent context drift and ensure that future AI sessions and developer workflows always have the exact, up-to-date representation of the codebase.

---

## ⚡ Mandatory Instruction for AI Assistant

Whenever you complete ANY of the following:
1. **Implement a new feature or endpoint (Backend or Frontend)**
2. **Modify existing business logic or database schema**
3. **Refactor architectural layers, DI container, or Zustand stores**
4. **Fix significant bugs or edge cases**

**You MUST execute the following 4-step sync protocol before concluding your turn:**

### Step 1: Update Master Trackers
- Check off the completed items in [`FEATURE_TRACKER.md`](file:///d:/Backend%20Portfolio/DevFlow/FEATURE_TRACKER.md).
- Check off granular tasks in [`BACKEND_FEATURES.md`](file:///d:/Backend%20Portfolio/DevFlow/BACKEND_FEATURES.md) or [`FRONTEND_FEATURES.md`](file:///d:/Backend%20Portfolio/DevFlow/FRONTEND_FEATURES.md).

### Step 2: Append Entry to `.agents/context/FEATURE_LOG.md`
Append an entry with:
- Date / Timestamp
- Feature / Module name
- Short description of what was built or changed
- Affected files (Entities, Repositories, Services, Controllers, Routes, UI components, Hooks)
- New endpoints or Socket events added

### Step 3: Update `.agents/context/PROJECT_CONTEXT.md` (if structural changes occurred)
- If new tables/entities were added, add them to the Entities table.
- If new route modules or services were registered, update the Architecture section.
- If new environment variables were introduced, document them.

### Step 4: Verify TypeScript Compilation
- Run `npm run build:backend` and/or `npm run build:frontend` to guarantee zero broken imports or type regressions.
