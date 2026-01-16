import { describe, it, expect, vi } from "vitest";
import { prismaMock } from "@/test/mocks/prisma";

// Mock the prisma module before importing UserService
vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// Import after mocking
import { UserService } from "./UserService";

describe("UserService", () => {
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    image: "https://example.com/avatar.jpg",
    emailVerified: null,
    units: "imperial" as const,
    zipCode: null,
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockChallenge = {
    id: "challenge-123",
    season: "winter" as const,
    year: "2025/2026",
    daysCount: 30,
    current: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("createUser", () => {
    it("should create a user without challenge enrollment when no current challenge exists", async () => {
      prismaMock.challenge.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await UserService.createUser({
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/avatar.jpg",
      });

      expect(result).toEqual(mockUser);
      expect(prismaMock.challenge.findFirst).toHaveBeenCalledWith({
        where: { current: true },
      });
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          name: "Test User",
          image: "https://example.com/avatar.jpg",
          emailVerified: undefined,
        },
      });
    });

    it("should create a user with challenge enrollment when current challenge exists", async () => {
      prismaMock.challenge.findFirst.mockResolvedValue(mockChallenge);
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await UserService.createUser({
        email: "test@example.com",
        name: "Test User",
      });

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          name: "Test User",
          image: undefined,
          emailVerified: undefined,
          userChallenges: {
            create: {
              challengeId: "challenge-123",
              daysCount: 30,
            },
          },
        },
      });
    });
  });

  describe("findOrCreateUser", () => {
    it("should return existing user if found by email", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.findOrCreateUser({
        email: "test@example.com",
        name: "Test User",
      });

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    it("should create new user if not found by email", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.challenge.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await UserService.findOrCreateUser({
        email: "new@example.com",
        name: "New User",
      });

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "new@example.com" },
      });
      expect(prismaMock.user.create).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return user when found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.findById("user-123");

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
    });

    it("should return null when user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await UserService.findById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should return user when found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.findByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return null when user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await UserService.findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update user profile", async () => {
      const updatedUser = { ...mockUser, name: "Updated Name" };
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser("user-123", {
        name: "Updated Name",
      });

      expect(result).toEqual(updatedUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { name: "Updated Name" },
      });
    });

    it("should update user units and zipCode", async () => {
      const updatedUser = { ...mockUser, units: "metric" as const, zipCode: "12345" };
      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser("user-123", {
        units: "metric",
        zipCode: "12345",
      });

      expect(result).toEqual(updatedUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { units: "metric", zipCode: "12345" },
      });
    });
  });
});
