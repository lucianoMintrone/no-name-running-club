<!-- Short, focused instructions for AI coding agents working in this repository -->
# Copilot / AI Agent Instructions

Purpose: provide concise, actionable context so an AI coding agent can be productive immediately.

- **Big picture**: This is a Next.js 16 (App Router) TypeScript app deployed to Vercel, using Prisma + PostgreSQL for persistence and NextAuth for authentication. The app's UI lives under `src/app` and `src/components`. Business logic lives in `src/services` and database access uses the Prisma client exported from `src/lib/prisma.ts`.

- **Entry points & important files**
  - `src/app/` — Next.js App Router routes, pages and edge/server actions.
  - `src/lib/prisma.ts` — single Prisma client instance; always import this for DB access.
  - `prisma/schema.prisma` — canonical data model (User, Challenge, UserChallenge, Run).
  - `src/lib/auth.ts` and `src/lib/auth.config.ts` — NextAuth config and adapters. OAuth sign-in flows call `UserService.findOrCreateUser`.
  - `src/services/` — domain services (e.g., `UserService.ts`, `ChallengeService.ts`) — prefer adding business logic here rather than directly in routes.
  - `scripts/setup-challenges.ts` — a seeding script; `package.json` exposes `yarn db:setup-challenges` to run it.

- **DB / Migrations / CI**
  - Prisma is used for migrations and client generation. Key scripts in `package.json`:
    - `dev` — `next dev`
    - `build` — `prisma generate && prisma migrate deploy && next build` (this runs during Vercel builds)
    - `db:migrate` / `db:migrate:deploy` / `db:push` / `db:generate` / `db:studio`
  - Environment variables: `prisma/schema.prisma` uses `DATABASE_URL`. The README/CLAUDE files also mention `POSTGRES_URL` for Vercel — be mindful which env var the runtime expects and map them in deployment.
  - Migrations live in `prisma/migrations/` and should be committed.

- **Auth and user onboarding**
  - NextAuth v5 is configured; `src/lib/auth.ts` wires the Prisma adapter. OAuth callbacks update/create users via `UserService`.
  - For changes to onboarding (auto-enrollment), inspect `UserService.createUser` — it automatically enrolls new users in the current challenge.

- **Service / code patterns to follow**
  - Keep route handlers (server actions/API handlers) thin and delegate to `src/services/*` for business logic.
  - Use `prisma` from `src/lib/prisma.ts` (never create new PrismaClient instances in server code except in scripts/tools).
  - Use typed Prisma models and return shapes defined near services (e.g., `UserChallengeWithChallengeAndRuns` in `ChallengeService.ts`).

- **Common developer tasks / commands**
  - Local dev: `yarn dev`
  - Build (local/CI): `yarn build` (runs prisma generate + migrations then `next build`)
  - Run migrations (local): `yarn db:migrate`
  - Apply migrations (CI/Prod): `yarn db:migrate:deploy`
  - Open Prisma Studio: `yarn db:studio`
  - Seed/enroll users in current challenge: `yarn db:setup-challenges`

- **Examples and known locations**
  - Automatically enrolling users: `src/services/UserService.ts#createUser` (creates `userChallenges` when a current challenge exists).
  - Current challenge lookup: `src/services/ChallengeService.ts#getCurrentChallenge`.
  - Auth sign-in hook: `src/lib/auth.ts` — calls `UserService.findOrCreateUser` for Google users.

- **What NOT to change lightly**
  - `prisma/schema.prisma` and files under `prisma/migrations/` — altering schema requires migration files and migration review.
  - `src/lib/prisma.ts` — keep the Prisma client singleton pattern intact.
  - NextAuth core wiring in `src/lib/auth.ts` without understanding callback impacts (sessions/jwt token mapping).

- **If you need to make changes**
  - For DB changes: add Prisma migration (`yarn db:migrate`), commit `prisma/migrations/*`, and ensure `prisma generate` runs in build.
  - For auth changes: search for `UserService` and `src/lib/auth.ts` to update onboarding/sign-in flows.

If anything here is unclear or you'd like more project-specific examples (tests, component patterns, or common refactors), say which area and I'll expand with concrete code snippets.
