---
name: systematic-debug
description: "Structured root-cause analysis and debugging protocol for DevFlow full-stack monorepo issues across PostgreSQL, TypeORM, Express, Redis, BullMQ, Socket.IO, and React/dnd-kit."
metadata:
  author: devflow-architect
  version: "1.0.0"
---

# Systematic Debugging Protocol (DevFlow)

Use this skill whenever an error, regression, failed test, network failure, or unexplained behavior occurs in DevFlow.

---

## 🔍 The 5-Step Diagnostic Protocol

### Step 1: Trace & Isolate
Identify where the failure originated:
- **Client UI:** React rendering, state mutation, hook dependency, or dnd-kit sensor.
- **Network / Transport:** 4xx/5xx HTTP status, CORS header, or missing Authorization header.
- **Backend API:** Middleware failure, Zod validation mismatch, controller error, or service logic.
- **Database / Cache:** TypeORM query error, missing migration, PostgreSQL foreign key constraint, or Redis connection timeout.
- **Real-Time / Queue:** Socket room disconnect or BullMQ job failure.

### Step 2: Reproduce Minimally
- Isolate the failing endpoint or user action with a curl command, Jest test, or browser console inspection.

### Step 3: Inspect Logs & Stack Traces
- Check Winston backend logs and terminal output.
- Check browser console errors and React component stack traces.

### Step 4: Implement Surgical Fix
- Make the minimal required fix following architectural layers (never hack across layers or bypass validations).

### Step 5: Verify & Add Guard
- Run `npm run build:backend` and `npm run build:frontend`.
- Log the incident in `.agents/context/KNOWN_FOOTGUNS.md` if it represents a repeatable edge case.
