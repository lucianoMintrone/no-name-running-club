import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Season } from "@prisma/client";

export async function GET() {
  try {
    // Create the winter 2025/2026 challenge
    const challenge = await prisma.challenge.upsert({
      where: {
        season_year: { season: Season.winter, year: "2025/2026" },
      },
      update: { current: true },
      create: {
        season: Season.winter,
        year: "2025/2026",
        current: true,
        daysCount: 30,
      },
    });

    // Enroll all existing users
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    });

    const enrolled = [];
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
      enrolled.push(user.email);
    }

    return NextResponse.json({
      success: true,
      challenge: {
        id: challenge.id,
        season: challenge.season,
        year: challenge.year,
        current: challenge.current,
        daysCount: challenge.daysCount,
      },
      enrolledUsers: enrolled,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
