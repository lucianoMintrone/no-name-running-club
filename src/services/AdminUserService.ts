import { prisma } from "@/lib/prisma";

export class AdminUserService {
  static async updateUserRole(userId: string, role: "member" | "admin"): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  static async deleteUser(userId: string): Promise<void> {
    // Cascades delete userChallenges, runs, accounts, sessions
    await prisma.user.delete({ where: { id: userId } });
  }
}

