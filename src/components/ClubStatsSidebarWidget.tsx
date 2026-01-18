"use client";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";

interface LeaderboardEntry {
  firstName: string;
  temperature: number;
  image?: string | null;
}

interface ParticipantRunCount {
  firstName: string;
  runCount: number;
  image?: string | null;
}

interface AllTimeRecord {
  name: string;
  temperature: number;
  image?: string | null;
}

interface MostRunsAllTime {
  name: string;
  runCount: number;
  challengeTitle: string;
  image?: string | null;
}

interface ClubStatsSidebarWidgetProps {
  allTimeRecord: AllTimeRecord | null;
  leaderboard: LeaderboardEntry[];
  runCounts: ParticipantRunCount[];
  mostRunsAllTime: MostRunsAllTime | null;
}

export function ClubStatsSidebarWidget({ 
  allTimeRecord, 
  leaderboard, 
  runCounts,
  mostRunsAllTime,
}: ClubStatsSidebarWidgetProps) {
  const [open, setOpen] = useState(false);

  const totalRuns = runCounts.reduce((sum, entry) => sum + entry.runCount, 0);
  const totalParticipants = runCounts.length;

  // Don't show if no data
  if (!allTimeRecord && leaderboard.length === 0 && runCounts.length === 0) return null;

  return (
    <>
      {/* Floating Stats button with tag - positioned above Strava button on right side */}
      {!open && (
        <div className="fixed top-1/2 -translate-y-14 right-8 z-50 flex items-center gap-3">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full shadow-md">
            See Club Standings
          </span>
          <button
            aria-label="Open club stats"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg hover:from-indigo-500 hover:to-purple-600 transition-all duration-200 hover:scale-105"
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" aria-hidden="true">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
            aria-label="Close stats sidebar"
          />
          {/* Sidebar - slides in from right */}
          <aside className="relative h-full w-full max-w-md bg-gradient-to-b from-slate-50 via-white to-slate-100 shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -left-32 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-100/30 to-transparent" />
            </div>

            {/* Close button */}
            <button
              aria-label="Close sidebar"
              className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-slate-200/80 hover:bg-slate-300/80 text-slate-500 hover:text-slate-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
                <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative px-8 py-8 pt-20 flex flex-col gap-10 flex-1 overflow-y-auto">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Club Dashboard</h2>
                <p className="text-sm text-slate-500 mt-2">Your running community at a glance</p>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                  <div className="text-4xl font-bold text-slate-800">{totalRuns}</div>
                  <div className="text-sm text-slate-500 mt-2">Total Runs</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                  <div className="text-4xl font-bold text-slate-800">{totalParticipants}</div>
                  <div className="text-sm text-slate-500 mt-2">Active Runners</div>
                </div>
              </div>

              {/* ===== CURRENT CHALLENGE SECTION ===== */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Current Challenge</h3>
                </div>

                {/* Coldest Run - Current Challenge */}
                {leaderboard.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm mb-5">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Coldest Runs</span>
                    </div>
                    <div className="space-y-4">
                      {leaderboard.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            index === 0 ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white" :
                            index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700" :
                            index === 2 ? "bg-gradient-to-br from-slate-400 to-slate-500 text-white" :
                            "bg-slate-200 text-slate-500"
                          }`}>
                            {index + 1}
                          </div>
                          {entry.image && (
                            <Avatar
                              src={entry.image}
                              alt=""
                              size={32}
                              className="ring-2 ring-slate-200 flex-shrink-0"
                              fallbackText={entry.firstName}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-slate-700 truncate block font-medium">{entry.firstName}</span>
                          </div>
                          <span className="text-sm font-semibold text-blue-600 tabular-nums flex-shrink-0 whitespace-nowrap">{entry.temperature}°F</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Run Counts - Current Challenge */}
                {runCounts.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Run Count</span>
                    </div>
                    <div className="space-y-4">
                      {runCounts.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            index === 0 ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white" :
                            index === 1 ? "bg-slate-300 text-slate-600" :
                            index === 2 ? "bg-slate-200 text-slate-500" :
                            "bg-slate-100 text-slate-400"
                          }`}>
                            {index + 1}
                          </div>
                          {entry.image && (
                            <Avatar
                              src={entry.image}
                              alt=""
                              size={32}
                              className="ring-2 ring-slate-200 flex-shrink-0"
                              fallbackText={entry.firstName}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-slate-700 truncate block font-medium">{entry.firstName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-sm font-semibold text-emerald-600 tabular-nums">{entry.runCount}</span>
                            <span className="text-xs text-slate-400">runs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* ===== ALL-TIME RECORDS SECTION ===== */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">All-Time Records</h3>
                </div>

                {/* All-Time Coldest Run */}
                {allTimeRecord && (
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 relative overflow-hidden shadow-lg mb-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">Coldest Run Ever</span>
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-white">{allTimeRecord.temperature}°</span>
                            <span className="text-xl text-white/70">F</span>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            {allTimeRecord.image && (
                              <Avatar
                                src={allTimeRecord.image}
                                alt=""
                                size={24}
                                className="ring-2 ring-white/40 flex-shrink-0"
                                fallbackText={allTimeRecord.name}
                              />
                            )}
                            <span className="text-sm text-white/90 truncate">{allTimeRecord.name}</span>
                          </div>
                        </div>
                        <div className="text-5xl opacity-30 flex-shrink-0">❄️</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* All-Time Most Runs in a Challenge */}
                {mostRunsAllTime && (
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">Most Runs in a Challenge</span>
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">{mostRunsAllTime.runCount}</span>
                            <span className="text-lg text-white/70">runs</span>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            {mostRunsAllTime.image && (
                              <Avatar
                                src={mostRunsAllTime.image}
                                alt=""
                                size={24}
                                className="ring-2 ring-white/40 flex-shrink-0"
                                fallbackText={mostRunsAllTime.name}
                              />
                            )}
                            <span className="text-sm text-white/90 truncate">{mostRunsAllTime.name}</span>
                          </div>
                          <p className="text-xs text-white/60 mt-2 truncate">{mostRunsAllTime.challengeTitle}</p>
                        </div>
                        <div className="text-5xl opacity-30 flex-shrink-0">🏃</div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Footer branding */}
              <div className="text-center pt-6 pb-4">
                <p className="text-xs text-slate-400">NNRC • No Name Running Club</p>
              </div>
            </div>
          </aside>
        </div>
      )}
      <style jsx global>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
}
