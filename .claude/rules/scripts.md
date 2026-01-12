# Scripts Guidelines

## Running TypeScript Scripts

This project uses `tsx` to run TypeScript scripts. Always use `yarn` with the script name or `npx tsx` directly.

### Correct Usage

```bash
# Using yarn script (preferred)
yarn make-admin user@example.com

# Using npx tsx directly
npx tsx scripts/make-admin.ts user@example.com
```

### Incorrect Usage

```bash
# DON'T use ts-node (not installed)
npx ts-node scripts/make-admin.ts

# DON'T run .ts files directly with node
node scripts/make-admin.ts
```

## Adding New Scripts

1. Create the script in `scripts/` directory
2. Add a yarn script in `package.json`:
   ```json
   "script-name": "npx tsx scripts/script-name.ts"
   ```

## Running Scripts Against Production

Scripts that support production have a `--prod` flag that reads from `.env.production`:

```bash
# Local database (default)
yarn make-admin user@example.com

# Production database (uses .env.production)
yarn make-admin user@example.com --prod
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `make-admin` | `yarn make-admin <email> [--prod]` | Set a user as admin |
| `db:setup-challenges` | `yarn db:setup-challenges` | Seed challenge data |
