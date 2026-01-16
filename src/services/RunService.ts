import { prisma } from "@/lib/prisma";

export type SaveRunInput = {
  temperature: number;
  position: number;
};

export class RunService {
  static async getRunByPosition(userId: string, position: number) {
    const userChallenge = await prisma.userChallenge.findFirst({
      where: {
        userId,
        challenge: { current: true },
      },
      select: { id: true },
    });

    if (!userChallenge) {
      return null;
    }

    return prisma.run.findFirst({
      where: {
        userChallengeId: userChallenge.id,
        position,
      },
      select: {
        id: true,
        temperature: true,
        date: true,
        position: true,
      },
    });
  }

  static async saveRunForUser(userId: string, input: SaveRunInput) {
    const userChallenge = await prisma.userChallenge.findFirst({
      where: {
        userId,
        challenge: { current: true },
      },
      select: { id: true },
    });

    if (!userChallenge) {
      throw new Error("No active challenge found");
    }

    const existingRun = await prisma.run.findFirst({
      where: {
        userChallengeId: userChallenge.id,
        position: input.position,
      },
      select: { id: true },
    });

    const today = new Date();

    if (existingRun) {
      return prisma.run.update({
        where: { id: existingRun.id },
        data: {
          temperature: input.temperature,
          date: today,
        },
      });
    }

    return prisma.run.create({
      data: {
        userChallengeId: userChallenge.id,
        date: today,
        temperature: input.temperature,
        position: input.position,
      },
    });
  }
}

