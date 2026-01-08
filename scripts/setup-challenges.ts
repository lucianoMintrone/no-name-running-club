import "dotenv/config";
import { PrismaClient, Season } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting up challenges...\n");

  // Create the current winter 2025/2026 challenge
  const challenge = await prisma.challenge.upsert({
    where: {
      season_year: { season: Season.winter, year: "2025/2026" },
    },
    update: { current: true },
    create: {
      season: Season.winter,
      year: "2025/2026",
      current: true,
    },
  });

  console.log(`✓ Challenge created: ${challenge.season} ${challenge.year} (current: ${challenge.current})`);

  // Enroll all existing users in the current challenge
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  let enrolled = 0;
  for (const user of users) {
    await prisma.userChallenge.upsert({
      where: {
        userId_challengeId: { userId: user.id, challengeId: challenge.id },
      },
      update: {},
      create: {
        userId: user.id,
        challengeId: challenge.id,
      },
    });
    enrolled++;
    console.log(`  → Enrolled: ${user.email}`);
  }

  console.log(`\n✓ Enrolled ${enrolled} existing user(s) in the challenge`);
  console.log("\nDone!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
