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
  image?: string | null;
}

export interface AllTimeRecord {
  name: string;
  temperature: number;
  date: Date;
  challengeTitle: string;
  image?: string | null;
}

export interface ActiveChallengeWithLeaderboard {
  id: string;
  title: string;
  leaderboard: LeaderboardEntry[];
}

export class ChallengeService {
  private static firstNameFromFullName(fullName: string | null): string {
    const safe = (fullName || "Anonymous").trim();
    const first = safe.split(/\s+/)[0];
    return first || "Anonymous";
  }

  private static leaderboardFromUserMap(
    byUser: Map<string, LeaderboardEntry>
  ): LeaderboardEntry[] {
    return Array.from(byUser.values()).sort((a, b) => a.temperature - b.temperature);
  }

  private static addColdestRunIfMissing(
    byUser: Map<string, LeaderboardEntry>,
    run: {
      temperature: number;
      date: Date;
      userChallenge: {
        userId: string;
        user: { name: string | null; image: string | null };
      };
    }
  ) {
    const userId = run.userChallenge.userId;
    if (byUser.has(userId)) return;

    byUser.set(userId, {
      firstName: this.firstNameFromFullName(run.userChallenge.user.name),
      temperature: run.temperature,
      date: run.date,
      image: run.userChallenge.user.image,
    });
  }

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

    // Get all runs with temperature for the current challenge, ordered by temperature (coldest first)
    const runs = await prisma.run.findMany({
      where: {
        userChallenge: {
          challengeId: currentChallenge.id,
        },
        temperature: { not: null },
      },
      orderBy: [{ temperature: "asc" }, { date: "asc" }],
      select: {
        temperature: true,
        date: true,
        userChallenge: {
          select: {
            userId: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const userColdestRuns = new Map<string, LeaderboardEntry>();
    for (const run of runs) {
      // `temperature` is non-null via query filter
      this.addColdestRunIfMissing(userColdestRuns, {
        temperature: run.temperature as number,
        date: run.date,
        userChallenge: run.userChallenge,
      });
    }

    return this.leaderboardFromUserMap(userColdestRuns);
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

  /**
   * Gets all active challenges with their leaderboards.
   */
  static async getActiveChallengesWithLeaderboards(): Promise<ActiveChallengeWithLeaderboard[]> {
    const activeChallenges = await prisma.challenge.findMany({
      where: { current: true },
    });

    if (activeChallenges.length === 0) {
      return [];
    }

    const challengeIds = activeChallenges.map((c) => c.id);

    // Fetch all relevant runs for all active challenges in one query (avoid N+1).
    // We order by temperature ASC so the first run we see per user is the coldest.
    const runs = await prisma.run.findMany({
      where: {
        temperature: { not: null },
        userChallenge: {
          challengeId: { in: challengeIds },
        },
      },
      orderBy: [{ temperature: "asc" }, { date: "asc" }],
      select: {
        temperature: true,
        date: true,
        userChallenge: {
          select: {
            userId: true,
            challengeId: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // challengeId -> (userId -> coldest entry)
    const coldestByChallenge = new Map<string, Map<string, LeaderboardEntry>>();
    for (const run of runs) {
      const challengeId = run.userChallenge.challengeId;

      const byUser =
        coldestByChallenge.get(challengeId) ??
        new Map<string, LeaderboardEntry>();

      if (!coldestByChallenge.has(challengeId)) {
        coldestByChallenge.set(challengeId, byUser);
      }

      // `temperature` is non-null via query filter and global ordering makes first-seen per user coldest
      this.addColdestRunIfMissing(byUser, {
        temperature: run.temperature as number,
        date: run.date,
        userChallenge: {
          userId: run.userChallenge.userId,
          user: run.userChallenge.user,
        },
      });
    }

    return activeChallenges.map((challenge) => {
      const leaderboard = this.leaderboardFromUserMap(
        coldestByChallenge.get(challenge.id) ?? new Map()
      );

      return {
        id: challenge.id,
        title: this.formatChallengeTitle(challenge),
        leaderboard,
      };
    });
  }

  /**
   * Gets the all-time club record (coldest run across all challenges).
   */
  static async getAllTimeRecord(): Promise<AllTimeRecord | null> {
    const coldestRun = await prisma.run.findFirst({
      where: {
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
                image: true,
              },
            },
            challenge: true,
          },
        },
      },
    });

    if (!coldestRun) {
      return null;
    }

    return {
      name: coldestRun.userChallenge.user.name || "Anonymous",
      temperature: coldestRun.temperature!,
      date: coldestRun.date,
      challengeTitle: this.formatChallengeTitle(coldestRun.userChallenge.challenge),
      image: coldestRun.userChallenge.user.image,
    };
  }
}
