import { prisma } from "@/lib/prisma";
import type { Challenge, UserChallenge, Run } from "@prisma/client";

export type UserChallengeWithChallenge = UserChallenge & {
  challenge: Challenge;
};

export type UserChallengeWithChallengeAndRuns = UserChallenge & {
  challenge: Challenge;
  runs: Run[];
};

export interface ColdestRunInfo {
  temperature: number;
  date: Date;
  position: number;
}

export interface LeaderboardEntry {
  firstName: string;
  temperature: number;
  date: Date;
}

export class ChallengeService {
  /**
   * Gets the current active challenge.
   */
  static async getCurrentChallenge(): Promise<Challenge | null> {
    return prisma.challenge.findFirst({
      where: { current: true },
    });
  }

  /**
   * Gets a user's enrollment in the current challenge with runs.
   */
  static async getUserCurrentChallenge(
    userId: string
  ): Promise<UserChallengeWithChallengeAndRuns | null> {
    return prisma.userChallenge.findFirst({
      where: {
        userId,
        challenge: {
          current: true,
        },
      },
      include: {
        challenge: true,
        runs: true,
      },
    });
  }

  /**
   * Gets the coldest run for a user's current challenge.
   */
  static async getColdestRun(userId: string): Promise<ColdestRunInfo | null> {
    const userChallenge = await prisma.userChallenge.findFirst({
      where: {
        userId,
        challenge: {
          current: true,
        },
      },
      include: {
        runs: {
          where: {
            temperature: { not: null },
          },
          orderBy: {
            temperature: "asc",
          },
          take: 1,
        },
      },
    });

    if (!userChallenge?.runs[0]) {
      return null;
    }

    const coldestRun = userChallenge.runs[0];
    return {
      temperature: coldestRun.temperature!,
      date: coldestRun.date,
      position: coldestRun.position,
    };
  }

  /**
   * Gets the leaderboard for the current challenge (coldest runs across all users).
   */
  static async getChallengeLeaderboard(): Promise<LeaderboardEntry[]> {
    const currentChallenge = await prisma.challenge.findFirst({
      where: { current: true },
    });

    if (!currentChallenge) {
      return [];
    }

    // Get all runs with temperature for the current challenge, ordered by temperature
    const runs = await prisma.run.findMany({
      where: {
        userChallenge: {
          challengeId: currentChallenge.id,
        },
        temperature: { not: null },
      },
      orderBy: {
        temperature: "asc",
      },
      include: {
        userChallenge: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Get unique users with their coldest run
    const userColdestRuns = new Map<string, LeaderboardEntry>();
    for (const run of runs) {
      const userId = run.userChallenge.userId;
      if (!userColdestRuns.has(userId)) {
        const fullName = run.userChallenge.user.name || "Anonymous";
        const firstName = fullName.split(" ")[0];
        userColdestRuns.set(userId, {
          firstName,
          temperature: run.temperature!,
          date: run.date,
        });
      }
    }

    // Convert to array and sort by temperature
    return Array.from(userColdestRuns.values()).sort(
      (a, b) => a.temperature - b.temperature
    );
  }

  /**
   * Formats the challenge title based on season and year.
   * e.g., "Winter 2025/2026 Challenge" or "Summer 2026 Challenge"
   */
  static formatChallengeTitle(challenge: Challenge): string {
    const seasonCapitalized =
      challenge.season.charAt(0).toUpperCase() + challenge.season.slice(1);
    return `${seasonCapitalized} ${challenge.year} Challenge`;
  }
}
