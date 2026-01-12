import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: "tucker@coalesce.nyc" },
    data: { role: "admin" },
  });
  const msg = `✓ Updated ${user.email} to role: ${user.role}`;
  console.log(msg);
  fs.writeFileSync("/workspaces/no-name-running-club/admin-result.txt", msg);
}

main()
  .catch((e) => {
    console.error(e);
    fs.writeFileSync("/workspaces/no-name-running-club/admin-result.txt", `ERROR: ${e.message}`);
  })
  .finally(() => prisma.$disconnect());
