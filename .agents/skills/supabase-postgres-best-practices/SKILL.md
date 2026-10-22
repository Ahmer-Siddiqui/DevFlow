---
name: supabase-postgres-best-practices
description: "Guidelines and best practices for managing PostgreSQL on Supabase in DevFlow, covering connection pooling, PgBouncer transaction mode, SSL requirements, migrations, and index optimization."
metadata:
  author: devflow-architect
  version: "1.0.0"
---

# Supabase PostgreSQL Best Practices (DevFlow)

Use this skill when modifying database schema, configuring database connections, or diagnosing database connection pool issues.

---

## 🔌 1. Connection Modes & Pooling
- **Transaction Mode (Port 6543 / Pooler):** Use for serverless or high-concurrency Node.js Express workloads. Note that prepared statements must be disabled in TypeORM when using transaction pooler mode.
- **Session Mode / Direct Connection (Port 5432):** Required for running schema migrations (`npm run migration:run`), as DDL statements need direct session support.
- **SSL Enforcement:** Always set `ssl: { rejectUnauthorized: false }` or appropriate SSL cert config in `data-source.ts` when connecting to Supabase in cloud environments.

---

## 🗄️ 2. Migration Invariants
- Never edit existing applied migrations in production.
- Always generate migrations using TypeORM CLI to reflect entity modifications.
- Test migrations down (`migration:revert`) before committing.
