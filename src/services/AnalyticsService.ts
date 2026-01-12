import { prisma } from "@/lib/prisma";

export interface OverviewStats {
  totalUsers: number;
  totalRuns: number;
  totalChallenges: number;
  averageRunsPerUser: number;
  userGrowthThisMonth: number;
  runsThisMonth: number;
}

export interface ChallengeParticipation {
  challengeId: string;
  challengeName: string;
  totalParticipants: number;
  totalRuns: number;
  completedUsers: number;
  completionRate: number;
  averageTemperature: number | null;
  coldestRun: number | null;
  daysCount: number;
}

export interface RunsByDay {
  date: string;
  count: number;
}

export interface TemperatureDistribution {
  range: string;
  count: number;
  minTemp: number;
  maxTemp: number;
}

export interface UserEngagement {
  activeUsersLast7Days: number;
  activeUsersLast30Days: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  runsLast7Days: number;
  runsLast30Days: number;
}

export interface LeaderboardExport {
  rank: number;
  userName: string;
  userEmail: string;
  totalRuns: number;
  coldestTemp: number | null;
  averageTemp: number | null;
}

export class AnalyticsService {
  /**
   * Get high-level overview statistics
   */
  static async getOverviewStats(): Promise<OverviewStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, totalRuns, totalChallenges, usersThisMonth, runsThisMonth] =
      await Promise.all([
        prisma.user.count(),
        prisma.run.count(),
        prisma.challenge.count(),
        prisma.user.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
        prisma.run.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
      ]);

    return {
      totalUsers,
      totalRuns,
      totalChallenges,
      averageRunsPerUser: totalUsers > 0 ? Math.round((totalRuns / totalUsers) * 10) / 10 : 0,
      userGrowthThisMonth: usersThisMonth,
      runsThisMonth,
    };
  }

  /**
   * Get detailed participation stats for a specific challenge
   */
  static async getChallengeParticipation(
    challengeId: string
  ): Promise<ChallengeParticipation | null> {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        userChallenges: {
          include: {
            runs: true,
          },
        },
      },
    });

    if (!challenge) return null;

    const totalParticipants = challenge.userChallenges.length;
    const allRuns = challenge.userChallenges.flatMap((uc) => uc.runs);
    const totalRuns = allRuns.length;

    // Users who completed all days
    const completedUsers = challenge.userChallenges.filter(
      (uc) => uc.runs.length >= uc.daysCount
    ).length;

    // Temperature stats
    const temperatures = allRuns
      .map((r) => r.temperature)
      .filter((t): t is number => t !== null);
    
    const averageTemperature =
      temperatures.length > 0
        ? Math.round(temperatures.reduce((a, b) => a + b, 0) / temperatures.length)
        : null;
    
    const coldestRun = temperatures.length > 0 ? Math.min(...temperatures) : null;

    return {
      challengeId: challenge.id,
      challengeName: `${challenge.season.charAt(0).toUpperCase() + challenge.season.slice(1)} ${challenge.year}`,
      totalParticipants,
      totalRuns,
      completedUsers,
      completionRate: totalParticipants > 0 
        ? Math.round((completedUsers / totalParticipants) * 100) 
        : 0,
      averageTemperature,
      coldestRun,
      daysCount: challenge.daysCount,
    };
  }

  /**
   * Get participation stats for all challenges
   */
  static async getAllChallengeParticipation(): Promise<ChallengeParticipation[]> {
    const challenges = await prisma.challenge.findMany({
      orderBy: [{ year: "desc" }, { season: "asc" }],
      select: { id: true },
    });

    const stats = await Promise.all(
      challenges.map((c) => this.getChallengeParticipation(c.id))
    );

    return stats.filter((s): s is ChallengeParticipation => s !== null);
  }

  /**
   * Get user engagement metrics
   */
  static async getUserEngagement(): Promise<UserEngagement> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Active users = users who logged a run in the period
    const [
      activeUsers7Days,
      activeUsers30Days,
      newUsers7Days,
      newUsers30Days,
      runs7Days,
      runs30Days,
    ] = await Promise.all([
      prisma.run.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { userChallenge: { select: { userId: true } } },
        distinct: ["userChallengeId"],
      }),
      prisma.run.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { userChallenge: { select: { userId: true } } },
        distinct: ["userChallengeId"],
      }),
      prisma.user.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.run.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.run.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    // Get unique user IDs
    const uniqueUsers7Days = new Set(activeUsers7Days.map((r) => r.userChallenge.userId));
    const uniqueUsers30Days = new Set(activeUsers30Days.map((r) => r.userChallenge.userId));

    return {
      activeUsersLast7Days: uniqueUsers7Days.size,
      activeUsersLast30Days: uniqueUsers30Days.size,
      newUsersLast7Days: newUsers7Days,
      newUsersLast30Days: newUsers30Days,
      runsLast7Days: runs7Days,
      runsLast30Days: runs30Days,
    };
  }

  /**
   * Get runs per day for the last N days
   */
  static async getRunsByDay(days: number = 30): Promise<RunsByDay[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const runs = await prisma.run.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by date
    const runsByDate = new Map<string, number>();
    
    // Initialize all dates with 0
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      runsByDate.set(date.toISOString().split("T")[0], 0);
    }

    // Count runs per date
    runs.forEach((run) => {
      const dateKey = run.createdAt.toISOString().split("T")[0];
      runsByDate.set(dateKey, (runsByDate.get(dateKey) || 0) + 1);
    });

    return Array.from(runsByDate.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }

  /**
   * Get temperature distribution for a challenge
   */
  static async getTemperatureDistribution(
    challengeId?: string
  ): Promise<TemperatureDistribution[]> {
    const whereClause = challengeId
      ? { userChallenge: { challengeId } }
      : {};

    const runs = await prisma.run.findMany({
      where: whereClause,
      select: { temperature: true },
    });

    const temperatures = runs
      .map((r) => r.temperature)
      .filter((t): t is number => t !== null);

    if (temperatures.length === 0) {
      return [];
    }

    // Create distribution buckets (every 10 degrees)
    const buckets: Map<string, { count: number; minTemp: number; maxTemp: number }> = new Map();
    
    // Define temperature ranges
    const ranges = [
      { label: "< -10°F", min: -100, max: -10 },
      { label: "-10 to 0°F", min: -10, max: 0 },
      { label: "0 to 10°F", min: 0, max: 10 },
      { label: "10 to 20°F", min: 10, max: 20 },
      { label: "20 to 32°F", min: 20, max: 32 },
      { label: "32 to 40°F", min: 32, max: 40 },
      { label: "40 to 50°F", min: 40, max: 50 },
      { label: "> 50°F", min: 50, max: 150 },
    ];

    ranges.forEach((range) => {
      buckets.set(range.label, { count: 0, minTemp: range.min, maxTemp: range.max });
    });

    temperatures.forEach((temp) => {
      for (const range of ranges) {
        if (temp >= range.min && temp < range.max) {
          const bucket = buckets.get(range.label)!;
          bucket.count++;
          break;
        }
      }
    });

    return Array.from(buckets.entries()).map(([range, data]) => ({
      range,
      count: data.count,
      minTemp: data.minTemp,
      maxTemp: data.maxTemp,
    }));
  }

  /**
   * Export leaderboard data for a challenge
   */
  static async exportLeaderboard(challengeId: string): Promise<LeaderboardExport[]> {
    const userChallenges = await prisma.userChallenge.findMany({
      where: { challengeId },
      include: {
        user: { select: { name: true, email: true } },
        runs: { select: { temperature: true } },
      },
    });

    const leaderboard = userChallenges
      .map((uc) => {
        const temps = uc.runs
          .map((r) => r.temperature)
          .filter((t): t is number => t !== null);
        
        return {
          userName: uc.user.name || "Unknown",
          userEmail: uc.user.email,
          totalRuns: uc.runs.length,
          coldestTemp: temps.length > 0 ? Math.min(...temps) : null,
          averageTemp: temps.length > 0 
            ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) 
            : null,
        };
      })
      .sort((a, b) => b.totalRuns - a.totalRuns || (a.coldestTemp ?? 999) - (b.coldestTemp ?? 999));

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
  }

  /**
   * Export all users with their stats
   */
  static async exportUsers(): Promise<Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    totalChallenges: number;
    totalRuns: number;
  }>> {
    const users = await prisma.user.findMany({
      include: {
        userChallenges: {
          include: { _count: { select: { runs: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      totalChallenges: user.userChallenges.length,
      totalRuns: user.userChallenges.reduce((acc, uc) => acc + uc._count.runs, 0),
    }));
  }

  /**
   * Export challenge data with all runs
   */
  static async exportChallengeData(challengeId: string): Promise<{
    challenge: {
      id: string;
      season: string;
      year: string;
      daysCount: number;
    };
    runs: Array<{
      userName: string;
      userEmail: string;
      date: Date;
      position: number;
      temperature: number | null;
      distance: number | null;
      durationInMinutes: number | null;
    }>;
  } | null> {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        userChallenges: {
          include: {
            user: { select: { name: true, email: true } },
            runs: {
              orderBy: { position: "asc" },
            },
          },
        },
      },
    });

    if (!challenge) return null;

    const runs = challenge.userChallenges.flatMap((uc) =>
      uc.runs.map((run) => ({
        userName: uc.user.name || "Unknown",
        userEmail: uc.user.email,
        date: run.date,
        position: run.position,
        temperature: run.temperature,
        distance: run.distance,
        durationInMinutes: run.durationInMinutes,
      }))
    );

    return {
      challenge: {
        id: challenge.id,
        season: challenge.season,
        year: challenge.year,
        daysCount: challenge.daysCount,
      },
      runs: runs.sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  }
}
