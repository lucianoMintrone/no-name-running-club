import { AnalyticsService } from "@/services/AnalyticsService";

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export class AdminExportService {
  static async exportUsers(format: "csv" | "json"): Promise<string> {
    const users = await AnalyticsService.exportUsers();

    if (format === "json") return JSON.stringify(users, null, 2);

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
  }

  static async exportChallenge(challengeId: string, format: "csv" | "json"): Promise<string> {
    const data = await AnalyticsService.exportChallengeData(challengeId);
    if (!data) throw new Error("Challenge not found");

    if (format === "json") return JSON.stringify(data, null, 2);

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
  }

  static async exportLeaderboard(challengeId: string, format: "csv" | "json"): Promise<string> {
    const leaderboard = await AnalyticsService.exportLeaderboard(challengeId);
    if (format === "json") return JSON.stringify(leaderboard, null, 2);

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
  }

  static async exportAllChallengeStats(format: "csv" | "json"): Promise<string> {
    const stats = await AnalyticsService.getAllChallengeParticipation();
    if (format === "json") return JSON.stringify(stats, null, 2);

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
  }
}

