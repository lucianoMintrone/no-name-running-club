import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

function loadEnvFile(envPath: string): void {
  if (!fs.existsSync(envPath)) {
    console.error(`Error: ${envPath} not found`);
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length > 0) {
      let value = valueParts.join("=");
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

// Parse arguments
const args = process.argv.slice(2);
const prodFlag = args.includes("--prod");
const filteredArgs = args.filter(arg => arg !== "--prod");
const email = filteredArgs[0];

// Load production env if --prod flag is set
if (prodFlag) {
  const envProdPath = path.join(process.cwd(), ".env.production");
  console.log("Loading production environment from .env.production...");
  loadEnvFile(envProdPath);
}

const prisma = new PrismaClient();

async function main() {
  if (!email) {
    console.error("Usage: yarn make-admin <email> [--prod]");
    console.error("");
    console.error("Options:");
    console.error("  --prod    Use production database (reads from .env.production)");
    console.error("");
    console.error("Examples:");
    console.error("  yarn make-admin user@example.com          # Local database");
    console.error("  yarn make-admin user@example.com --prod   # Production database");
    process.exit(1);
  }

  console.log(`Environment: ${prodFlag ? "PRODUCTION" : "local"}`);
  console.log(`Target user: ${email}`);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    console.error(`Error: User with email "${email}" not found`);
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log(`✓ Updated ${user.email} to role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
