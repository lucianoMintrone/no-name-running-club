import { describe, it, expect, vi } from "vitest";
import { prismaMock } from "@/test/mocks/prisma";

// Mock the prisma module before importing AnalyticsService
vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// Import after mocking
import { AnalyticsService } from "./AnalyticsService";

describe("AnalyticsService", () => {
  const mockChallenge = {
    id: "challenge-123",
    season: "winter" as const,
    year: "2025/2026",
    daysCount: 30,
    current: true,
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2025-12-01"),
  };

  const mockRun = {
    id: "run-123",
    userChallengeId: "uc-123",
    position: 1,
    date: new Date("2025-12-05"),
    temperature: 25,
    distance: null,
    durationInMinutes: null,
    units: null,
    createdAt: new Date("2025-12-05"),
    updatedAt: new Date("2025-12-05"),
  };

  describe("getOverviewStats", () => {
    it("should return correct overview statistics", async () => {
      prismaMock.user.count.mockResolvedValueOnce(100); // totalUsers
      prismaMock.run.count.mockResolvedValueOnce(500); // totalRuns
      prismaMock.challenge.count.mockResolvedValue(5); // totalChallenges
      prismaMock.user.count.mockResolvedValueOnce(10); // usersThisMonth
      prismaMock.run.count.mockResolvedValueOnce(50); // runsThisMonth

      const result = await AnalyticsService.getOverviewStats();

      expect(result).toEqual({
        totalUsers: 100,
        totalRuns: 500,
        totalChallenges: 5,
        averageRunsPerUser: 5,
        userGrowthThisMonth: 10,
        runsThisMonth: 50,
      });
    });

    it("should handle zero users gracefully", async () => {
      prismaMock.user.count.mockResolvedValue(0);
      prismaMock.run.count.mockResolvedValue(0);
      prismaMock.challenge.count.mockResolvedValue(0);

      const result = await AnalyticsService.getOverviewStats();

      expect(result.averageRunsPerUser).toBe(0);
    });
  });

  describe("getChallengeParticipation", () => {
    it("should return null when challenge not found", async () => {
      prismaMock.challenge.findUnique.mockResolvedValue(null);

      const result = await AnalyticsService.getChallengeParticipation("non-existent");

      expect(result).toBeNull();
    });

    it("should calculate correct participation stats", async () => {
      const mockChallengeWithData = {
        ...mockChallenge,
        userChallenges: [
          {
            id: "uc-1",
            userId: "user-1",
            challengeId: "challenge-123",
            daysCount: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
            runs: [
              { ...mockRun, id: "run-1", temperature: 10 },
              { ...mockRun, id: "run-2", temperature: 20 },
            ],
          },
          {
            id: "uc-2",
            userId: "user-2",
            challengeId: "challenge-123",
            daysCount: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
            runs: [
              { ...mockRun, id: "run-3", temperature: 5 },
            ],
          },
        ],
      };

      prismaMock.challenge.findUnique.mockResolvedValue(mockChallengeWithData as unknown as never);

      const result = await AnalyticsService.getChallengeParticipation("challenge-123");

      expect(result).not.toBeNull();
      expect(result!.totalParticipants).toBe(2);
      expect(result!.totalRuns).toBe(3);
      expect(result!.coldestRun).toBe(5);
      expect(result!.averageTemperature).toBe(12); // (10+20+5)/3 = 11.67 rounded to 12
      expect(result!.completionRate).toBe(0); // No one completed 30 runs
    });

    it("should calculate completion rate correctly", async () => {
      const mockChallengeWithCompletedUser = {
        ...mockChallenge,
        daysCount: 2, // Only 2 days needed
        userChallenges: [
          {
            id: "uc-1",
            userId: "user-1",
            challengeId: "challenge-123",
            daysCount: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            runs: [
              { ...mockRun, id: "run-1" },
              { ...mockRun, id: "run-2" },
            ],
          },
          {
            id: "uc-2",
            userId: "user-2",
            challengeId: "challenge-123",
            daysCount: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            runs: [
              { ...mockRun, id: "run-3" },
            ],
          },
        ],
      };

      prismaMock.challenge.findUnique.mockResolvedValue(mockChallengeWithCompletedUser as unknown as never);

      const result = await AnalyticsService.getChallengeParticipation("challenge-123");

      expect(result!.completedUsers).toBe(1);
      expect(result!.completionRate).toBe(50); // 1 of 2 users completed
    });
  });

  describe("getUserEngagement", () => {
    it("should return engagement metrics", async () => {
      // Mock active users (runs with user info)
      prismaMock.run.findMany.mockResolvedValueOnce([
        { userChallenge: { userId: "user-1" } },
        { userChallenge: { userId: "user-2" } },
      ] as unknown as never); // 7 days
      prismaMock.run.findMany.mockResolvedValueOnce([
        { userChallenge: { userId: "user-1" } },
        { userChallenge: { userId: "user-2" } },
        { userChallenge: { userId: "user-3" } },
      ] as unknown as never); // 30 days

      prismaMock.user.count.mockResolvedValueOnce(5); // new users 7 days
      prismaMock.user.count.mockResolvedValueOnce(15); // new users 30 days
      prismaMock.run.count.mockResolvedValueOnce(20); // runs 7 days
      prismaMock.run.count.mockResolvedValueOnce(100); // runs 30 days

      const result = await AnalyticsService.getUserEngagement();

      expect(result.activeUsersLast7Days).toBe(2);
      expect(result.activeUsersLast30Days).toBe(3);
      expect(result.newUsersLast7Days).toBe(5);
      expect(result.newUsersLast30Days).toBe(15);
      expect(result.runsLast7Days).toBe(20);
      expect(result.runsLast30Days).toBe(100);
    });
  });

  describe("getRunsByDay", () => {
    it("should return runs grouped by day", async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      prismaMock.run.findMany.mockResolvedValue([
        { createdAt: today },
        { createdAt: today },
        { createdAt: yesterday },
      ] as unknown as never);

      const result = await AnalyticsService.getRunsByDay(7);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      
      // Find today's entry
      const todayKey = today.toISOString().split("T")[0];
      const todayEntry = result.find((r) => r.date === todayKey);
      expect(todayEntry?.count).toBe(2);
    });

    it("should initialize all days with zero counts", async () => {
      prismaMock.run.findMany.mockResolvedValue([]);

      const result = await AnalyticsService.getRunsByDay(7);

      // Should have 8 entries (7 days + today)
      expect(result.length).toBe(8);
      expect(result.every((r) => r.count === 0)).toBe(true);
    });
  });

  describe("getTemperatureDistribution", () => {
    it("should return empty array when no runs exist", async () => {
      prismaMock.run.findMany.mockResolvedValue([]);

      const result = await AnalyticsService.getTemperatureDistribution();

      expect(result).toEqual([]);
    });

    it("should group temperatures into correct buckets", async () => {
      prismaMock.run.findMany.mockResolvedValue([
        { temperature: 5 },
        { temperature: 15 },
        { temperature: 25 },
        { temperature: 35 },
        { temperature: null }, // Should be filtered out
      ] as unknown as never);

      const result = await AnalyticsService.getTemperatureDistribution();

      expect(result.length).toBeGreaterThan(0);
      
      // Find the 0-10 bucket
      const bucket0to10 = result.find((r) => r.range === "0 to 10°F");
      expect(bucket0to10?.count).toBe(1); // Only 5°F
      
      // Find the 10-20 bucket
      const bucket10to20 = result.find((r) => r.range === "10 to 20°F");
      expect(bucket10to20?.count).toBe(1); // Only 15°F
    });
  });

  describe("exportLeaderboard", () => {
    it("should return ranked leaderboard", async () => {
      prismaMock.userChallenge.findMany.mockResolvedValue([
        {
          user: { name: "Alice", email: "alice@example.com" },
          runs: [
            { temperature: 10 },
            { temperature: 20 },
            { temperature: 15 },
          ],
        },
        {
          user: { name: "Bob", email: "bob@example.com" },
          runs: [
            { temperature: 5 },
          ],
        },
      ] as unknown as never);

      const result = await AnalyticsService.exportLeaderboard("challenge-123");

      expect(result).toHaveLength(2);
      expect(result[0].rank).toBe(1);
      expect(result[0].userName).toBe("Alice"); // More runs
      expect(result[0].totalRuns).toBe(3);
      expect(result[0].coldestTemp).toBe(10);
      expect(result[1].rank).toBe(2);
      expect(result[1].userName).toBe("Bob");
    });

    it("should handle users with no name", async () => {
      prismaMock.userChallenge.findMany.mockResolvedValue([
        {
          user: { name: null, email: "anonymous@example.com" },
          runs: [{ temperature: 20 }],
        },
      ] as unknown as never);

      const result = await AnalyticsService.exportLeaderboard("challenge-123");

      expect(result[0].userName).toBe("Unknown");
    });
  });

  describe("exportUsers", () => {
    it("should return all users with stats", async () => {
      prismaMock.user.findMany.mockResolvedValue([
        {
          id: "user-1",
          name: "Test User",
          email: "test@example.com",
          role: "member",
          createdAt: new Date("2025-12-01"),
          userChallenges: [
            { _count: { runs: 5 } },
            { _count: { runs: 10 } },
          ],
        },
      ] as unknown as never);

      const result = await AnalyticsService.exportUsers();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Test User");
      expect(result[0].totalChallenges).toBe(2);
      expect(result[0].totalRuns).toBe(15);
    });
  });

  describe("exportChallengeData", () => {
    it("should return null when challenge not found", async () => {
      prismaMock.challenge.findUnique.mockResolvedValue(null);

      const result = await AnalyticsService.exportChallengeData("non-existent");

      expect(result).toBeNull();
    });

    it("should return challenge data with runs", async () => {
      prismaMock.challenge.findUnique.mockResolvedValue({
        ...mockChallenge,
        userChallenges: [
          {
            user: { name: "Test User", email: "test@example.com" },
            runs: [
              {
                date: new Date("2025-12-05"),
                position: 1,
                temperature: 25,
                distance: 3.5,
                durationInMinutes: 30,
              },
            ],
          },
        ],
      } as unknown as never);

      const result = await AnalyticsService.exportChallengeData("challenge-123");

      expect(result).not.toBeNull();
      expect(result!.challenge.id).toBe("challenge-123");
      expect(result!.challenge.season).toBe("winter");
      expect(result!.runs).toHaveLength(1);
      expect(result!.runs[0].userName).toBe("Test User");
      expect(result!.runs[0].temperature).toBe(25);
    });
  });
});
