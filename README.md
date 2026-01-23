This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

### Prisma Studio

View and edit your database with a visual GUI:

```bash
# Local database
yarn db:studio

# Production database
DEPLOY_ENV=production yarn db:studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555).

### Database Commands

```bash
# Development
yarn db:migrate         # Create and apply migrations
yarn db:studio          # Open Prisma Studio GUI
yarn db:generate        # Regenerate Prisma client

# Production
yarn deploy             # Run migrations + deploy to Vercel
yarn db:migrate:deploy  # Apply pending migrations only
```

### Production Migration Workflow

Migrations are applied before deploy via the `yarn deploy` command (not during the Vercel build, as the direct database endpoint is not reachable from Vercel's build containers).

1. Create migrations locally with `yarn db:migrate`
2. Commit the migration files in `prisma/migrations/`
3. Deploy with `yarn deploy` — runs migrations against production, then deploys

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Vercel CLI installed: `npm i -g vercel`
- A Prisma Postgres database (via [Prisma Data Platform](https://console.prisma.io/))

### Setup Steps

1. **Configure environment variables**

   In your Vercel project settings (Settings → Environment Variables), add:

   ```
   PRISMA_DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...
   DATABASE_URL=postgres://...@db.prisma.io:5432/postgres?sslmode=require
   ```

   Also create a local `.env.production` file with the same variables.

2. **Deploy**

   ```bash
   # Link your project (first time only)
   vercel link

   # Deploy to production (runs migrations first)
   yarn deploy
   ```

### Environment Variables Reference

| Variable              | Description                                          | Required |
| --------------------- | ---------------------------------------------------- | -------- |
| `PRISMA_DATABASE_URL` | Prisma Accelerate URL (runtime connection)           | Yes      |
| `DATABASE_URL`        | Direct PostgreSQL URL (migrations via `directUrl`)   | Yes      |

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
