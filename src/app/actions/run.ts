"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChallengeService } from "@/services/ChallengeService";

export interface CreateRunInput {
  date: string;
  durationInMinutes: number;
  distance: number;
  units: "imperial" | "metric";
  position: number;
}

export async function createRun(input: CreateRunInput) {
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

  const run = await prisma.run.create({
    data: {
      userChallengeId: userChallenge.id,
      date: new Date(input.date),
      durationInMinutes: input.durationInMinutes,
      distance: input.distance,
      units: input.units,
      position: input.position,
    },
  });

  return run;
}
