"use server";

import { withAdminAuth } from "@/lib/admin";
import { Season } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AdminChallengeService } from "@/services/AdminChallengeService";
import { AdminUserService } from "@/services/AdminUserService";
import { AdminRunService } from "@/services/AdminRunService";
import { AdminExportService } from "@/services/AdminExportService";
import { getCheckbox, getRequiredInt, getRequiredString } from "@/lib/validation";

// ============================================
// Challenge Management
// ============================================

export async function createChallenge(formData: FormData) {
  return withAdminAuth(async () => {
<<<<<<< HEAD
    const season = formData.get("season") as string;
    const year = formData.get("year") as string;
    const daysCount = parseInt(formData.get("daysCount") as string, 10);
    const current = formData.get("current") === "on";
    const enrollAll = formData.get("enrollAll") === "on";
    const stravaUrl = formData.get("stravaUrl") as string | null;
    const stravaEmbedCode = formData.get("stravaEmbedCode") as string | null;

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
        stravaUrl: stravaUrl || null,
        stravaEmbedCode: stravaEmbedCode || null,
      },
    });
=======
    const season = formData.get("season") as string;
    const year = formData.get("year") as string;
    const daysCount = parseInt(formData.get("daysCount") as string, 10);
    const current = formData.get("current") === "on";
    const enrollAll = formData.get("enrollAll") === "on";
    const stravaUrl = formData.get("stravaUrl") as string | null;

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
        stravaUrl: stravaUrl || null,
      },
>>>>>>> 74b47f0 (feat: add Strava widget integration and comprehensive E2E test suite)
    });

    revalidatePath("/admin/challenges");
    return challenge;
  });
}

export async function updateChallenge(id: string, formData: FormData) {
  return withAdminAuth(async () => {
<<<<<<< HEAD
    const season = formData.get("season") as string;
    const year = formData.get("year") as string;
    const daysCount = parseInt(formData.get("daysCount") as string, 10);
    const current = formData.get("current") === "on";
    const stravaUrl = formData.get("stravaUrl") as string | null;
    const stravaEmbedCode = formData.get("stravaEmbedCode") as string | null;

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
        stravaUrl: stravaUrl || null,
        stravaEmbedCode: stravaEmbedCode || null,
      },
    });
=======
    const season = formData.get("season") as string;
    const year = formData.get("year") as string;
    const daysCount = parseInt(formData.get("daysCount") as string, 10);
    const current = formData.get("current") === "on";
    const stravaUrl = formData.get("stravaUrl") as string | null;

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
        stravaUrl: stravaUrl || null,
      },
>>>>>>> 74b47f0 (feat: add Strava widget integration and comprehensive E2E test suite)
    });

    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${id}`);
    return challenge;
  });
}

export async function deleteChallenge(id: string) {
  return withAdminAuth(async () => {
    // This will cascade delete userChallenges and runs
    await AdminChallengeService.deleteChallenge(id);
    revalidatePath("/admin/challenges");
  });
}

export async function setCurrentChallenge(id: string) {
  return withAdminAuth(async () => {
    await AdminChallengeService.setCurrentChallenge(id);

    revalidatePath("/admin/challenges");
    revalidatePath("/");
  });
}

export async function enrollAllUsersInChallenge(challengeId: string) {
  return withAdminAuth(async () => {
    const result = await AdminChallengeService.enrollAllUsersInChallenge(challengeId);

    revalidatePath("/admin/challenges");
    revalidatePath(`/admin/challenges/${challengeId}`);
    return result;
  });
}

// ============================================
// User Management
// ============================================

export async function updateUserRole(userId: string, role: "member" | "admin") {
  return withAdminAuth(async () => {
    await AdminUserService.updateUserRole(userId, role);

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
  });
}

export async function deleteUser(userId: string) {
  return withAdminAuth(async () => {
    // This will cascade delete userChallenges, runs, accounts, sessions
    await AdminUserService.deleteUser(userId);
    revalidatePath("/admin/users");
  });
}

export async function enrollUserInChallenge(userId: string, challengeId: string) {
  return withAdminAuth(async () => {
    await AdminChallengeService.enrollUserInChallenge(userId, challengeId);

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
  });
}

export async function unenrollUserFromChallenge(userId: string, challengeId: string) {
  return withAdminAuth(async () => {
    await AdminChallengeService.unenrollUserFromChallenge(userId, challengeId);

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
    await AdminRunService.updateRun(runId, data);

    revalidatePath("/admin/runs");
  });
}

export async function deleteRun(runId: string) {
  return withAdminAuth(async () => {
    await AdminRunService.deleteRun(runId);
    revalidatePath("/admin/runs");
    revalidatePath("/");
  });
}

// ============================================
// Analytics & Export
// ============================================

export async function exportUsers(format: "csv" | "json"): Promise<string> {
  return withAdminAuth(async () => {
    return AdminExportService.exportUsers(format);
  });
}

export async function exportChallenge(
  challengeId: string,
  format: "csv" | "json"
): Promise<string> {
  return withAdminAuth(async () => {
    return AdminExportService.exportChallenge(challengeId, format);
  });
}

export async function exportLeaderboard(
  challengeId: string,
  format: "csv" | "json"
): Promise<string> {
  return withAdminAuth(async () => {
    return AdminExportService.exportLeaderboard(challengeId, format);
  });
}

export async function exportAllChallengeStats(format: "csv" | "json"): Promise<string> {
  return withAdminAuth(async () => {
    return AdminExportService.exportAllChallengeStats(format);
  });
}
