import { describe, it, expect, vi } from "vitest";
import { prismaMock } from "@/test/mocks/prisma";

// Mock the prisma module before importing ChallengeService
vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// Import after mocking
import { ChallengeService } from "./ChallengeService";

describe("ChallengeService", () => {
  const mockChallenge = {
    id: "challenge-123",
    season: "winter" as const,
    year: "2025/2026",
    daysCount: 30,
    current: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserChallenge = {
    id: "uc-123",
    userId: "user-123",
    challengeId: "challenge-123",
    daysCount: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRun = {
    id: "run-123",
    userChallengeId: "uc-123",
    position: 1,
    date: new Date("2025-12-05"),
    temperature: -5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("getCurrentChallenge", () => {
    it("should return the current challenge when one exists", async () => {
      prismaMock.challenge.findFirst.mockResolvedValue(mockChallenge);

      const result = await ChallengeService.getCurrentChallenge();

      expect(result).toEqual(mockChallenge);
      expect(prismaMock.challenge.findFirst).toHaveBeenCalledWith({
        where: { current: true },
      });
    });

    it("should return null when no current challenge exists", async () => {
      prismaMock.challenge.findFirst.mockResolvedValue(null);

      const result = await ChallengeService.getCurrentChallenge();

      expect(result).toBeNull();
    });
  });

  describe("getUserCurrentChallenge", () => {
    it("should return user's current challenge with runs", async () => {
      prismaMock.userChallenge.findFirst.mockResolvedValue(mockUserChallenge);

      const result = await ChallengeService.getUserCurrentChallenge("user-123");

      expect(result).toEqual(mockUserChallenge);
      expect(prismaMock.userChallenge.findFirst).toHaveBeenCalledWith({
        where: {
          userId: "user-123",
          challenge: {
            current: true,
          },
        },
        include: {
          challenge: true,
          runs: true,
        },
      });
    });

    it("should return null when user is not enrolled in current challenge", async () => {
      prismaMock.userChallenge.findFirst.mockResolvedValue(null);

      const result = await ChallengeService.getUserCurrentChallenge("user-456");

      expect(result).toBeNull();
    });
  });

  describe("getColdestRun", () => {
    it("should return the coldest run info when runs exist", async () => {
      const userChallengeWithRuns = {
        ...mockUserChallenge,
        challenge: mockChallenge,
        runs: [mockRun],
      };
      prismaMock.userChallenge.findFirst.mockResolvedValue(userChallengeWithRuns as unknown as never);

      const result = await ChallengeService.getColdestRun("user-123");

      expect(result).toEqual({
        temperature: -5,
        date: mockRun.date,
        position: 1,
      });
    });

    it("should return null when no runs exist", async () => {
      prismaMock.userChallenge.findFirst.mockResolvedValue({
        ...mockUserChallenge,
        challenge: mockChallenge,
        runs: [],
      } as unknown as never);

      const result = await ChallengeService.getColdestRun("user-123");

      expect(result).toBeNull();
    });

    it("should return null when user challenge doesn't exist", async () => {
      prismaMock.userChallenge.findFirst.mockResolvedValue(null);

      const result = await ChallengeService.getColdestRun("user-456");

      expect(result).toBeNull();
    });
  });

  describe("formatChallengeTitle", () => {
    it("should format winter challenge title correctly", () => {
      const result = ChallengeService.formatChallengeTitle(mockChallenge);

      expect(result).toBe("Winter 2025/2026 Challenge");
    });

    it("should format summer challenge title correctly", () => {
      const summerChallenge = {
        ...mockChallenge,
        season: "summer" as const,
        year: "2026",
      };

      const result = ChallengeService.formatChallengeTitle(summerChallenge);

      expect(result).toBe("Summer 2026 Challenge");
    });
  });

  describe("getChallengeLeaderboard", () => {
    it("should return empty array when no current challenge exists", async () => {
      prismaMock.challenge.findFirst.mockResolvedValue(null);

      const result = await ChallengeService.getChallengeLeaderboard();

      expect(result).toEqual([]);
    });

    it("should return leaderboard sorted by temperature", async () => {
      prismaMock.challenge.findFirst.mockResolvedValue(mockChallenge);
      prismaMock.run.findMany.mockResolvedValue([
        {
          ...mockRun,
          id: "run-1",
          temperature: 10,
          userChallenge: {
            ...mockUserChallenge,
            userId: "user-1",
            user: { name: "Alice Smith", image: "alice.jpg" },
          },
        },
        {
          ...mockRun,
          id: "run-2",
          temperature: -5,
          userChallenge: {
            ...mockUserChallenge,
            userId: "user-2",
            user: { name: "Bob Jones", image: "bob.jpg" },
          },
        },
      ] as unknown as never);

      const result = await ChallengeService.getChallengeLeaderboard();

      expect(result).toHaveLength(2);
      expect(result[0].firstName).toBe("Bob");
      expect(result[0].temperature).toBe(-5);
      expect(result[1].firstName).toBe("Alice");
      expect(result[1].temperature).toBe(10);
    });
  });

  describe("getAllTimeRecord", () => {
    it("should return null when no runs exist", async () => {
      prismaMock.run.findFirst.mockResolvedValue(null);

      const result = await ChallengeService.getAllTimeRecord();

      expect(result).toBeNull();
    });

    it("should return the all-time coldest run", async () => {
      prismaMock.run.findFirst.mockResolvedValue({
        ...mockRun,
        temperature: -20,
        userChallenge: {
          ...mockUserChallenge,
          user: { name: "Record Holder", image: "record.jpg" },
          challenge: mockChallenge,
        },
      } as unknown as never);

      const result = await ChallengeService.getAllTimeRecord();

      expect(result).toEqual({
        name: "Record Holder",
        temperature: -20,
        date: mockRun.date,
        challengeTitle: "Winter 2025/2026 Challenge",
        image: "record.jpg",
      });
    });
  });
});
