"use client";

import { useState } from "react";
import { PastChallengeCard } from "./PastChallengeCard";

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

interface PastChallenge {
  id: string;
  title: string;
  dateRange: string;
  daysCount: number;
  completedPositions: number[];
  stats: PastChallengeStats;
}

interface PastChallengesSectionProps {
  challenges: PastChallenge[];
}

export function PastChallengesSection({ challenges }: PastChallengesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (challenges.length === 0) {
    return null;
  }

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-lg font-bold text-gray-900 text-center">Past Challenges</h2>
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const isExpanded = expandedId === challenge.id;
          return (
            <div key={challenge.id}>
              {/* Collapsed tile */}
              <button
                onClick={() => handleToggle(challenge.id)}
                className={`w-full flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left ${
                  isExpanded ? "rounded-b-none" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-500">{challenge.dateRange}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-gray-400">
                    {challenge.completedPositions.length}/{challenge.daysCount} runs
                  </span>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="bg-white rounded-b-xl shadow-sm border-t border-gray-100 animate-expand-down overflow-hidden">
                  <div className="p-4 pt-2">
                    <PastChallengeCard
                      title={challenge.title}
                      daysCount={challenge.daysCount}
                      completedPositions={challenge.completedPositions}
                      stats={challenge.stats}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes expand-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        .animate-expand-down {
          animation: expand-down 0.2s ease-out;
        }
      `}</style>
    </section>
  );
}
