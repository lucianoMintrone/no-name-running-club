import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting up challenge...");
  
  // Create the winter 2025/2026 challenge
  const challenge = await prisma.challenge.upsert({
    where: {
      season_year: { season: "winter", year: "2025/2026" },
    },
    update: { current: true },
    create: {
      season: "winter",
      year: "2025/2026",
      current: true,
      daysCount: 30,
    },
  });
  
  console.log("✓ Challenge created:", challenge.id, challenge.season, challenge.year);
  
  // Get all users
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log("Users found:", users.length);
  
  // Enroll each user
  for (const user of users) {
    await prisma.userChallenge.upsert({
      where: {
        userId_challengeId: { userId: user.id, challengeId: challenge.id },
      },
      update: {},
      create: {
        userId: user.id,
        challengeId: challenge.id,
        daysCount: challenge.daysCount,
      },
    });
    console.log("  → Enrolled:", user.email);
  }
  
  console.log("\n✓ Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
