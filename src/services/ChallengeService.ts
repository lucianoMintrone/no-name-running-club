import { prisma } from "@/lib/prisma";
import type { Challenge, UserChallenge } from "@prisma/client";

export type UserChallengeWithChallenge = UserChallenge & {
  challenge: Challenge;
};

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
   * Gets a user's enrollment in the current challenge.
   */
  static async getUserCurrentChallenge(
    userId: string
  ): Promise<UserChallengeWithChallenge | null> {
    return prisma.userChallenge.findFirst({
      where: {
        userId,
        challenge: {
          current: true,
        },
      },
      include: {
        challenge: true,
      },
    });
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
