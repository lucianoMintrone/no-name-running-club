# Database, OOP & Modeling Guidelines

## Database Migrations

All database schema changes MUST be created through Prisma migrations to ensure:
- Code can be shared and synced between team members
- Production deployments are consistent and reproducible
- Schema history is tracked in version control

### Creating Migrations

1. **Update the schema first**: Modify `prisma/schema.prisma` with your changes
2. **Generate migration**: Run `yarn db:migrate` to create a new migration
3. **Review the SQL**: Check the generated `.sql` file in `prisma/migrations/`
4. **Commit both**: Always commit the schema change AND the migration together

### Manual Migrations

If you need to create a migration manually (e.g., for data migrations or complex alterations):

1. Create a timestamped folder: `prisma/migrations/YYYYMMDDHHMMSS_description/`
2. Add a `migration.sql` file with your SQL statements
3. Test locally before committing

### Committed Migrations Are Immutable

**NEVER modify a migration that has already been committed to version control.**

Once a migration is committed:
- Other developers may have already run it
- Production may have already applied it
- Modifying it will cause drift between environments

If you need to change something in a committed migration:
1. **ASK the user first** if any other devs or production have run the migration
2. If yes (or unsure): Create a NEW migration with the changes (e.g., `ALTER TABLE ... ADD COLUMN`)
3. If no (confirmed by user): You may rollback and recreate, but this is risky

### Rollback (Use with Caution)

To rollback a migration that has NOT been shared:

```bash
# Rollback the last migration (deletes migration folder and undoes DB changes)
yarn prisma migrate reset  # WARNING: This resets the entire database!

# Or manually:
# 1. Delete the migration folder
# 2. Revert schema.prisma changes
# 3. Run: yarn db:migrate to create a fresh migration
```

**Preferred approach**: Always create a new migration instead of rolling back.

### Commands

```bash
yarn db:migrate        # Create and apply migrations (development)
yarn db:migrate:deploy # Apply pending migrations (production)
yarn db:generate       # Regenerate Prisma client after schema changes
yarn db:studio         # Open Prisma Studio GUI for data inspection
```

## OOP & Service Layer

### Services (`src/services/`)

- Business logic should live in service classes, not in API routes or components
- Services are stateless and use static methods
- Each service focuses on a single domain (e.g., `UserService`, `ChallengeService`)

### Models

- Prisma models define the database schema in `prisma/schema.prisma`
- Use relations to connect models (e.g., `UserChallenge` belongs to `User` and `Challenge`)
- Add `@@unique` constraints for composite uniqueness
- Use `onDelete: Cascade` for automatic cleanup of related records

### Naming Conventions

- **Tables/Models**: PascalCase singular (e.g., `User`, `Challenge`, `UserChallenge`)
- **Fields**: camelCase (e.g., `userId`, `createdAt`, `daysCount`)
- **Enums**: PascalCase for enum name, lowercase for values
- **Migrations**: `YYYYMMDDHHMMSS_snake_case_description`
