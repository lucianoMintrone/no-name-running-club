# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start development server
yarn build        # Build for production (runs prisma generate first)
yarn lint         # Run ESLint
yarn db:push      # Push Prisma schema to database (no migration)
yarn db:migrate   # Create and apply migrations
yarn db:studio    # Open Prisma Studio GUI
yarn db:generate  # Generate Prisma client
```

## URLs

- **Production**: https://no-name-running-club.vercel.app/
- **Local**: http://localhost:3000

## Architecture

This is a Next.js 16 app using the App Router, deployed on Vercel with PostgreSQL.

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/lib/prisma.ts` - Prisma client singleton (use this for all DB access)
- `src/lib/auth.ts` - NextAuth.js config with Prisma adapter
- `src/lib/auth.config.ts` - Edge-compatible auth config (for middleware)
- `src/services/` - Business logic services (Clean Architecture interactors)
- `src/generated/prisma/` - Generated Prisma client (do not edit)
- `prisma/schema.prisma` - Database schema definition

### Authentication
- NextAuth.js v5 with Google OAuth provider
- `src/services/UserService.ts` - User creation/lookup logic (extend here for onboarding flows)

### Database
- **Local**: PostgreSQL at `localhost:5432/no_name_running_club`
- **Production**: Vercel Postgres (configured via `POSTGRES_URL` env var)
- Prisma ORM with type-safe client generated to `src/generated/prisma/`

### Environment Files
- `.env` - Local development (not versioned)
- `.env.production` - Production settings (not versioned)
- `.env.example` - Template for required variables (versioned)

## Tech Stack
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL
- Vercel deployment
