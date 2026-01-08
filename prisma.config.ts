import { defineConfig } from "prisma/config";

// Load dotenv only in development (not needed on Vercel where env vars are injected)
if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
