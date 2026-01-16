import { prisma } from "@/lib/prisma";
import { Season, type Challenge } from "@prisma/client";

export type CreateChallengeParams = {
  season: Season;
  year: string;
  daysCount: number;
  current: boolean;
  enrollAll: boolean;
};

export type UpdateChallengeParams = {
  season: Season;
  year: string;
  daysCount: number;
  current: boolean;
};

export class AdminChallengeService {
  static async createChallenge(params: CreateChallengeParams): Promise<Challenge> {
    return prisma.$transaction(async (tx) => {
      if (params.current) {
        await tx.challenge.updateMany({
          where: { current: true },
          data: { current: false },
        });
      }

      const challenge = await tx.challenge.create({
        data: {
          season: params.season,
          year: params.year,
          daysCount: params.daysCount,
          current: params.current,
        },
      });

      if (params.enrollAll) {
        const users = await tx.user.findMany({ select: { id: true } });
        await tx.userChallenge.createMany({
          data: users.map((u) => ({
            userId: u.id,
            challengeId: challenge.id,
            daysCount: params.daysCount,
          })),
          skipDuplicates: true,
        });
      }

      return challenge;
    });
  }

  static async updateChallenge(id: string, params: UpdateChallengeParams): Promise<Challenge> {
    return prisma.$transaction(async (tx) => {
      if (params.current) {
        await tx.challenge.updateMany({
          where: { current: true, id: { not: id } },
          data: { current: false },
        });
      }

      return tx.challenge.update({
        where: { id },
        data: {
          season: params.season,
          year: params.year,
          daysCount: params.daysCount,
          current: params.current,
        },
      });
    });
  }

  static async deleteChallenge(id: string): Promise<void> {
    await prisma.challenge.delete({ where: { id } });
  }

  static async setCurrentChallenge(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.challenge.updateMany({
        where: { current: true },
        data: { current: false },
      });
      await tx.challenge.update({ where: { id }, data: { current: true } });
    });
  }

  static async enrollAllUsersInChallenge(challengeId: string): Promise<{ enrolled: number }> {
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error("Challenge not found");

    const users = await prisma.user.findMany({ select: { id: true } });
    await prisma.userChallenge.createMany({
      data: users.map((u) => ({
        userId: u.id,
        challengeId,
        daysCount: challenge.daysCount,
      })),
      skipDuplicates: true,
    });

    return { enrolled: users.length };
  }

  static async enrollUserInChallenge(userId: string, challengeId: string): Promise<void> {
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error("Challenge not found");

    await prisma.userChallenge.upsert({
      where: { userId_challengeId: { userId, challengeId } },
      update: {},
      create: {
        userId,
        challengeId,
        daysCount: challenge.daysCount,
      },
    });
  }

  static async unenrollUserFromChallenge(userId: string, challengeId: string): Promise<void> {
    await prisma.userChallenge.delete({
      where: { userId_challengeId: { userId, challengeId } },
    });
  }
}

