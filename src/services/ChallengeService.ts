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

export interface ParticipantRunCount {
  firstName: string;
  runCount: number;
  image?: string | null;
}

export interface ActiveChallengeWithLeaderboard {
  id: string;
  title: string;
  leaderboard: LeaderboardEntry[];
}

export interface PastChallengeStats {
  coldestRunWinner: {
    firstName: string;
    temperature: number;
    image?: string | null;
  } | null;
  runCountStandings: ParticipantRunCount[];
  userColdestRun: {
    temperature: number;
    position: number;
  } | null;
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

  /**
   * Gets the total run count by participant for the current challenge.
   */
  static async getRunCountsByParticipant(): Promise<ParticipantRunCount[]> {
    const currentChallenge = await prisma.challenge.findFirst({
      where: { current: true },
    });

    if (!currentChallenge) {
      return [];
    }

    // Get all runs for the current challenge grouped by user
    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        challengeId: currentChallenge.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        runs: true,
      },
    });

    const runCounts: ParticipantRunCount[] = userChallenges
      .filter((uc) => uc.runs.length > 0)
      .map((uc) => ({
        firstName: this.firstNameFromFullName(uc.user.name),
        runCount: uc.runs.length,
        image: uc.user.image,
      }))
      .sort((a, b) => b.runCount - a.runCount);

    return runCounts;
  }

  /**
   * Gets a user's past (non-current) challenges with their runs.
   */
  static async getUserPastChallenges(
    userId: string
  ): Promise<UserChallengeWithChallengeAndRuns[]> {
    return prisma.userChallenge.findMany({
      where: {
        userId,
        challenge: {
          current: false,
        },
      },
      include: {
        challenge: true,
        runs: true,
      },
      orderBy: {
        challenge: {
          createdAt: "desc",
        },
      },
    });
  }

  /**
   * Gets stats for a specific challenge: coldest run winner, run count standings, and user's coldest run.
   */
  static async getChallengeStats(
    challengeId: string,
    userId: string
  ): Promise<PastChallengeStats> {
    // Get all user challenges for this challenge with runs
    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        challengeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        runs: {
          orderBy: {
            temperature: "asc",
          },
        },
      },
    });

    // Find coldest run winner (across all participants)
    let coldestRunWinner: PastChallengeStats["coldestRunWinner"] = null;
    let coldestTemp = Infinity;

    for (const uc of userChallenges) {
      const coldestRun = uc.runs.find((r) => r.temperature !== null);
      if (coldestRun && coldestRun.temperature !== null && coldestRun.temperature < coldestTemp) {
        coldestTemp = coldestRun.temperature;
        coldestRunWinner = {
          firstName: this.firstNameFromFullName(uc.user.name),
          temperature: coldestRun.temperature,
          image: uc.user.image,
        };
      }
    }

    // Build run count standings (sorted by most runs)
    const runCountStandings: ParticipantRunCount[] = userChallenges
      .filter((uc) => uc.runs.length > 0)
      .map((uc) => ({
        firstName: this.firstNameFromFullName(uc.user.name),
        runCount: uc.runs.length,
        image: uc.user.image,
      }))
      .sort((a, b) => b.runCount - a.runCount);

    // Find current user's coldest run
    let userColdestRun: PastChallengeStats["userColdestRun"] = null;
    const userChallenge = userChallenges.find((uc) => uc.user.id === userId);
    if (userChallenge) {
      const coldestRun = userChallenge.runs.find((r) => r.temperature !== null);
      if (coldestRun && coldestRun.temperature !== null) {
        userColdestRun = {
          temperature: coldestRun.temperature,
          position: coldestRun.position,
        };
      }
    }

    return {
      coldestRunWinner,
      runCountStandings,
      userColdestRun,
    };
  }

  /**
   * Formats the challenge date range based on season and year.
   * e.g., "Dec 2025 - Feb 2026" for winter or "Jun - Aug 2026" for summer
   */
  static formatChallengeDateRange(challenge: Challenge): string {
    const year = challenge.year;
    if (challenge.season === "winter") {
      // Winter spans two years, e.g., "2025/2026"
      const [startYear, endYear] = year.includes("/")
        ? year.split("/")
        : [year, String(parseInt(year) + 1)];
      return `Dec ${startYear} - Feb ${endYear}`;
    } else {
      // Summer is within one year
      return `Jun - Aug ${year}`;
    }
  }

  /**
   * Gets the all-time record for most runs in a single challenge.
   */
  static async getMostRunsAllTime(): Promise<{
    name: string;
    runCount: number;
    challengeTitle: string;
    image?: string | null;
  } | null> {
    // Get all user challenges with their runs and challenge info
    const userChallenges = await prisma.userChallenge.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        challenge: true,
        runs: true,
      },
    });

    if (userChallenges.length === 0) {
      return null;
    }

    // Find the user challenge with the most runs
    let maxRuns = 0;
    let record: {
      name: string;
      runCount: number;
      challengeTitle: string;
      image?: string | null;
    } | null = null;

    for (const uc of userChallenges) {
      if (uc.runs.length > maxRuns) {
        maxRuns = uc.runs.length;
        record = {
          name: uc.user.name || "Anonymous",
          runCount: uc.runs.length,
          challengeTitle: this.formatChallengeTitle(uc.challenge),
          image: uc.user.image,
        };
      }
    }

    return record;
  }
}
