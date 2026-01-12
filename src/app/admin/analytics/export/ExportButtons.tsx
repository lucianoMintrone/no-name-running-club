"use client";

import { useState } from "react";
import {
  exportUsers,
  exportChallenge,
  exportLeaderboard,
  exportAllChallengeStats,
} from "@/app/actions/admin";

interface ExportButtonsProps {
  type: "users" | "challenge" | "leaderboard" | "allChallenges";
  challengeId?: string;
}

export default function ExportButtons({ type, challengeId }: ExportButtonsProps) {
  const [loading, setLoading] = useState<"csv" | "json" | null>(null);

  const handleExport = async (format: "csv" | "json") => {
    setLoading(format);
    try {
      let data: string;
      let filename: string;

      switch (type) {
        case "users":
          data = await exportUsers(format);
          filename = `nnrc-users-${Date.now()}.${format}`;
          break;
        case "challenge":
          if (!challengeId) throw new Error("Challenge ID required");
          data = await exportChallenge(challengeId, format);
          filename = `nnrc-challenge-${challengeId}-${Date.now()}.${format}`;
          break;
        case "leaderboard":
          if (!challengeId) throw new Error("Challenge ID required");
          data = await exportLeaderboard(challengeId, format);
          filename = `nnrc-leaderboard-${challengeId}-${Date.now()}.${format}`;
          break;
        case "allChallenges":
          data = await exportAllChallengeStats(format);
          filename = `nnrc-all-challenges-${Date.now()}.${format}`;
          break;
        default:
          throw new Error("Invalid export type");
      }

      // Create download
      const blob = new Blob([data], {
        type: format === "csv" ? "text/csv" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("csv")}
        disabled={loading !== null}
        className="flex-1 rounded-lg bg-nnrc-purple px-4 py-2 text-sm text-white hover:bg-nnrc-purple-dark disabled:opacity-50"
      >
        {loading === "csv" ? "Exporting..." : "Export CSV"}
      </button>
      <button
        onClick={() => handleExport("json")}
        disabled={loading !== null}
        className="flex-1 rounded-lg border border-nnrc-purple px-4 py-2 text-sm text-nnrc-purple hover:bg-nnrc-lavender-light disabled:opacity-50"
      >
        {loading === "json" ? "Exporting..." : "Export JSON"}
      </button>
    </div>
  );
}
