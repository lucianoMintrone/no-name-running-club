import { defineConfig } from "prisma/config";

// Only load dotenv locally - on Vercel, env vars are injected directly
// Check if we're in a Vercel build environment
const isVercel = process.env.VERCEL === "1";

if (!isVercel) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config();
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
