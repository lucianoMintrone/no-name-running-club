"use client";

import Image from "next/image";
import { Avatar } from "./Avatar";

interface PastChallengeStats {
  coldestRunWinner: {
    firstName: string;
    temperature: number;
    image?: string | null;
  } | null;
  runCountStandings: {
    firstName: string;
    runCount: number;
    image?: string | null;
  }[];
  userColdestRun: {
    temperature: number;
    position: number;
  } | null;
}

interface PastChallengeCardProps {
  title: string;
  daysCount: number;
  completedPositions: number[];
  stats: PastChallengeStats;
}

/**
 * A read-only version of ChallengeCard for displaying past challenge data.
 * Shows the stamp grid and progress but does not allow interactions.
 */
export function PastChallengeCard({
  title,
  daysCount,
  completedPositions,
  stats,
}: PastChallengeCardProps) {
  const completedCount = completedPositions.length;
  const progress = Math.round((completedCount / daysCount) * 100);
  const stamps = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Limit standings to top 5
  const topStandings = stats.runCountStandings.slice(0, 5);

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-3 text-center">
        <p className="text-sm text-gray-500">
          {completedCount} of {daysCount} runs ({progress}%)
        </p>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-gray-400 to-gray-500 h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Read-only stamp grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-5 gap-2">
          {stamps.map((number) => {
            const isCompleted = completedPositions.includes(number);
            return (
              <div
                key={number}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isCompleted
                    ? "bg-gray-200/60 ring-1 ring-gray-300/50"
                    : "bg-gray-50 text-sm font-medium text-gray-300"
                }`}
              >
                {isCompleted ? (
                  <Image
                    src="/logos/nnrc-stamp.svg"
                    alt="Completed"
                    width={28}
                    height={28}
                    className="h-7 w-7 opacity-60 grayscale"
                  />
                ) : (
                  number
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Summary Table */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Challenge Summary</h4>
        <div className="space-y-3">
          {/* Coldest Run Winner */}
          {stats.coldestRunWinner && (
            <div className="flex items-center justify-between bg-blue-50/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </span>
                <span className="text-xs text-gray-500">Coldest Run</span>
              </div>
              <div className="flex items-center gap-2">
                {stats.coldestRunWinner.image && (
                  <Avatar
                    src={stats.coldestRunWinner.image}
                    alt={stats.coldestRunWinner.firstName}
                    size={20}
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {stats.coldestRunWinner.firstName}
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {stats.coldestRunWinner.temperature}°F
                </span>
              </div>
            </div>
          )}

          {/* Your Coldest Run */}
          {stats.userColdestRun && (
            <div className="flex items-center justify-between bg-purple-50/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-purple-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span className="text-xs text-gray-500">Your Coldest</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Day {stats.userColdestRun.position}</span>
                <span className="text-sm font-bold text-purple-600">
                  {stats.userColdestRun.temperature}°F
                </span>
              </div>
            </div>
          )}

          {/* Run Count Standings */}
          {topStandings.length > 0 && (
            <div className="bg-gray-50/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                <span className="text-xs text-gray-500">Most Runs</span>
              </div>
              <div className="space-y-1.5">
                {topStandings.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 text-center font-medium ${
                        index === 0 ? "text-amber-500" : 
                        index === 1 ? "text-gray-400" : 
                        index === 2 ? "text-amber-700" : "text-gray-400"
                      }`}>
                        {index + 1}
                      </span>
                      {entry.image && (
                        <Avatar
                          src={entry.image}
                          alt={entry.firstName}
                          size={18}
                        />
                      )}
                      <span className="text-gray-700">{entry.firstName}</span>
                    </div>
                    <span className="text-gray-500 font-medium">{entry.runCount} runs</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
