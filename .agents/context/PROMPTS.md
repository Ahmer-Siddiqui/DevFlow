# Standard Feature Development Prompts (DevFlow)

Use these prompt templates for rapid phase execution:

---

## 1. Next Phase Kickoff Prompt
```markdown
Let's build Phase [X]: [Phase Name].
Follow the Teaching Mode:
1. Explain the architecture and data flow.
2. Review the entity models and API contracts.
3. Guide the step-by-step implementation.
4. Verify with compilation and testing.
5. Update FEATURE_TRACKER.md and FEATURE_LOG.md.
```

---

## 2. Backend Feature Implementation
```markdown
Implement the backend layer for [Module]:
- Entity with BaseTenantEntity and composite indexes.
- Repository interface and implementation.
- Service with business validations and AppError handling.
- Zod validation schemas.
- Express controller and routes with auth/tenant middleware.
- Verify with `npm run build:backend`.
```

---

## 3. Frontend Feature Implementation
```markdown
Implement the frontend layer for [Module]:
- TypeScript types and Zod schemas.
- Axios API client and TanStack Query hooks.
- Zustand UI slice (if needed).
- Presentational UI components with Tailwind CSS.
- Route integration and ProtectedRoute check.
- Verify with `npm run build:frontend`.
```
