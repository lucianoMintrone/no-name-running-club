"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChallengeService } from "@/services/ChallengeService";

export interface SaveRunInput {
  date: string;
  durationInMinutes: number;
  distance: number;
  units: "imperial" | "metric";
  position: number;
}

export async function saveRun(input: SaveRunInput) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const userChallenge = await ChallengeService.getUserCurrentChallenge(
    session.user.id
  );
  if (!userChallenge) {
    throw new Error("No active challenge found");
  }

  // Check if a run already exists for this position
  const existingRun = await prisma.run.findFirst({
    where: {
      userChallengeId: userChallenge.id,
      position: input.position,
    },
  });

  if (existingRun) {
    // Update existing run
    return prisma.run.update({
      where: { id: existingRun.id },
      data: {
        date: new Date(input.date),
        durationInMinutes: input.durationInMinutes,
        distance: input.distance,
        units: input.units,
      },
    });
  }

  // Create new run
  return prisma.run.create({
    data: {
      userChallengeId: userChallenge.id,
      date: new Date(input.date),
      durationInMinutes: input.durationInMinutes,
      distance: input.distance,
      units: input.units,
      position: input.position,
    },
  });
}
