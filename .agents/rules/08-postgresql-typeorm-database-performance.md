# Rule 08: PostgreSQL & TypeORM Database Performance Standards

## 🔍 1. Multi-Tenant Indexing Standards

Every multi-tenant table MUST include a composite index prefixing `organizationId`:
```typescript
@Entity('tasks')
@Index(['organizationId', 'projectId', 'status'])
@Index(['organizationId', 'assigneeId'])
export class TaskEntity { ... }
```

### Why:
PostgreSQL utilizes B-Tree indexes most effectively when queries filter by `organizationId` first, isolating tenant scans to a tiny fraction of the database buffer.

---

## ⚡ 2. Preventing N+1 Query Traps

### ❌ Anti-pattern:
```typescript
// Loops over tasks and triggers separate query per task:
for (const task of tasks) {
  task.assignee = await userRepo.findById(task.assigneeId);
}
```

### ✅ Standard:
Use eager joins or QueryBuilder joins with proper aliasing:
```typescript
return await this.repo
  .createQueryBuilder('task')
  .leftJoinAndSelect('task.assignee', 'assignee')
  .leftJoinAndSelect('task.labels', 'labels')
  .where('task.organizationId = :orgId', { orgId })
  .andWhere('task.projectId = :projectId', { projectId })
  .orderBy('task.order', 'ASC')
  .getMany();
```

---

## 🛡️ 3. Atomic Database Transactions

When mutating multiple related tables (e.g. creating an organization along with its default roles, initial owner membership, and sample project), always use database transactions:

```typescript
await AppDataSource.transaction(async (manager) => {
  const org = await manager.save(OrganizationEntity, newOrg);
  await manager.save(OrganizationMemberEntity, {
    organizationId: org.id,
    userId: ownerId,
    role: OrganizationRole.OWNER,
  });
});
```

---

## 🕒 4. Base Entity Convention
All entities must inherit from a common base class:
```typescript
export abstract class BaseTenantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```
