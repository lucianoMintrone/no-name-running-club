"use server";

import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/admin";
import { Season } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ============================================
// Challenge Management
// ============================================

export async function createChallenge(formData: FormData) {
  return withAdminAuth(async () => {
    const season = formData.get("season") as string;
    const year = formData.get("year") as string;
    const daysCount = parseInt(formData.get("daysCount") as string, 10);
    const current = formData.get("current") === "on";
    const enrollAll = formData.get("enrollAll") === "on";

    if (!season || !year || !daysCount) {
      throw new Error("Missing required fields");
    }

    // If setting as current, unset other current challenges
    if (current) {
      await prisma.challenge.updateMany({
        where: { current: true },
        data: { current: false },
      });
    }

    // Create the challenge
    const challenge = await prisma.challenge.create({
      data: {
        season: season as Season,
        year,
        daysCount,
        current,
      },
    });

    // Optionally enroll all users
    if (enrollAll) {
      const users = await prisma.user.findMany({ select: { id: true } });
      await prisma.userChallenge.createMany({
        data: users.map((user) => ({
          userId: user.id,
          challengeId: challenge.id,
          daysCount,
        })),
        skipDuplicates: true,
      });
    }

    revalidatePath("/admin/challenges");
    return challenge;
  });
}

export async function updateChallenge(id: string, formData: FormData) {
  return withAdminAuth(async () => {
    const season = formData.get("season") as string;
    const year = formData.get("year") as string;
    const daysCount = parseInt(formData.get("daysCount") as string, 10);
    const current = formData.get("current") === "on";

    if (!season || !year || !daysCount) {
      throw new Error("Missing required fields");
    }

    // If setting as current, unset other current challenges
    if (current) {
      await prisma.challenge.updateMany({
        where: { current: true, id: { not: id } },
        data: { current: false },
      });
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: {
        season: season as Season,
        year,
        daysCount,
        current,
      },
    });

    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${id}`);
    return challenge;
  });
}

export async function deleteChallenge(id: string) {
  return withAdminAuth(async () => {
    // This will cascade delete userChallenges and runs
    await prisma.challenge.delete({ where: { id } });
    revalidatePath("/admin/challenges");
  });
}

export async function setCurrentChallenge(id: string) {
  return withAdminAuth(async () => {
    // Unset all current challenges
    await prisma.challenge.updateMany({
      where: { current: true },
      data: { current: false },
    });

    // Set the selected challenge as current
    await prisma.challenge.update({
      where: { id },
      data: { current: true },
    });

    revalidatePath("/admin/challenges");
    revalidatePath("/");
  });
}

export async function enrollAllUsersInChallenge(challengeId: string) {
  return withAdminAuth(async () => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    const users = await prisma.user.findMany({ select: { id: true } });
    
    await prisma.userChallenge.createMany({
      data: users.map((user) => ({
        userId: user.id,
        challengeId,
        daysCount: challenge.daysCount,
      })),
      skipDuplicates: true,
    });

    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${challengeId}`);
    return { enrolled: users.length };
  });
}

// ============================================
// User Management
// ============================================

export async function updateUserRole(userId: string, role: "member" | "admin") {
  return withAdminAuth(async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
  });
}

export async function deleteUser(userId: string) {
  return withAdminAuth(async () => {
    // This will cascade delete userChallenges, runs, accounts, sessions
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
  });
}

export async function enrollUserInChallenge(userId: string, challengeId: string) {
  return withAdminAuth(async () => {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    await prisma.userChallenge.upsert({
      where: {
        userId_challengeId: { userId, challengeId },
      },
      update: {},
      create: {
        userId,
        challengeId,
        daysCount: challenge.daysCount,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
  });
}

export async function unenrollUserFromChallenge(userId: string, challengeId: string) {
  return withAdminAuth(async () => {
    await prisma.userChallenge.delete({
      where: {
        userId_challengeId: { userId, challengeId },
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
  });
}

// ============================================
// Run Management
// ============================================

export async function updateRun(
  runId: string,
  data: { temperature?: number; position?: number }
) {
  return withAdminAuth(async () => {
    await prisma.run.update({
      where: { id: runId },
      data,
    });

    revalidatePath("/admin/runs");
  });
}

export async function deleteRun(runId: string) {
  return withAdminAuth(async () => {
    await prisma.run.delete({ where: { id: runId } });
    revalidatePath("/admin/runs");
    revalidatePath("/");
  });
}

// ============================================
// Analytics & Export
// ============================================

import { AnalyticsService } from "@/services/AnalyticsService";

export async function exportUsers(format: "csv" | "json"): Promise<string> {
  return withAdminAuth(async () => {
    const users = await AnalyticsService.exportUsers();

    if (format === "json") {
      return JSON.stringify(users, null, 2);
    }

    // CSV format
    const headers = ["ID", "Name", "Email", "Role", "Created At", "Total Challenges", "Total Runs"];
    const rows = users.map((u) => [
      u.id,
      u.name || "",
      u.email,
      u.role,
      u.createdAt.toISOString(),
      u.totalChallenges,
      u.totalRuns,
    ]);

    return [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
  });
}

export async function exportChallenge(
  challengeId: string,
  format: "csv" | "json"
): Promise<string> {
  return withAdminAuth(async () => {
    const data = await AnalyticsService.exportChallengeData(challengeId);

    if (!data) {
      throw new Error("Challenge not found");
    }

    if (format === "json") {
      return JSON.stringify(data, null, 2);
    }

    // CSV format
    const headers = [
      "User Name",
      "User Email",
      "Date",
      "Position",
      "Temperature (°F)",
      "Distance",
      "Duration (min)",
    ];
    const rows = data.runs.map((r) => [
      r.userName,
      r.userEmail,
      r.date.toISOString().split("T")[0],
      r.position,
      r.temperature ?? "",
      r.distance ?? "",
      r.durationInMinutes ?? "",
    ]);

    return [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
  });
}

export async function exportLeaderboard(
  challengeId: string,
  format: "csv" | "json"
): Promise<string> {
  return withAdminAuth(async () => {
    const leaderboard = await AnalyticsService.exportLeaderboard(challengeId);

    if (format === "json") {
      return JSON.stringify(leaderboard, null, 2);
    }

    // CSV format
    const headers = ["Rank", "Name", "Email", "Total Runs", "Coldest Temp (°F)", "Avg Temp (°F)"];
    const rows = leaderboard.map((l) => [
      l.rank,
      l.userName,
      l.userEmail,
      l.totalRuns,
      l.coldestTemp ?? "",
      l.averageTemp ?? "",
    ]);

    return [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
  });
}

export async function exportAllChallengeStats(format: "csv" | "json"): Promise<string> {
  return withAdminAuth(async () => {
    const stats = await AnalyticsService.getAllChallengeParticipation();

    if (format === "json") {
      return JSON.stringify(stats, null, 2);
    }

    // CSV format
    const headers = [
      "Challenge",
      "Days Count",
      "Participants",
      "Total Runs",
      "Completed Users",
      "Completion Rate (%)",
      "Avg Temp (°F)",
      "Coldest Temp (°F)",
    ];
    const rows = stats.map((s) => [
      s.challengeName,
      s.daysCount,
      s.totalParticipants,
      s.totalRuns,
      s.completedUsers,
      s.completionRate,
      s.averageTemperature ?? "",
      s.coldestRun ?? "",
    ]);

    return [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join("\n");
  });
}

// Helper function to escape CSV values
function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
