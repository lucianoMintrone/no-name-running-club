import { auth } from "@/lib/auth";
import { SignInModal } from "@/components/SignInModal";
import { SignOutButton } from "@/components/SignOutButton";
import { SettingsModal } from "@/components/SettingsModal";
import { ChallengeCard } from "@/components/ChallengeCard";
import { ColdestRunWidget } from "@/components/ColdestRunWidget";
import { LeaderboardWidget } from "@/components/LeaderboardWidget";
import { AllTimeRecordWidget } from "@/components/AllTimeRecordWidget";
import { ShareWidget } from "@/components/ShareWidget";
<<<<<<< HEAD
import { StravaWidget } from "@/components/StravaWidget";
import { ChallengeService, type ColdestRunInfo, type LeaderboardEntry, type ActiveChallengeWithLeaderboard, type AllTimeRecord } from "@/services/ChallengeService";
=======
import { StravaWidget } from "@/components/StravaWidget";
import { ChallengeService, type ColdestRunInfo, type LeaderboardEntry, type ActiveChallengeWithLeaderboard, type AllTimeRecord } from "@/services/ChallengeService";
>>>>>>> 74b47f0 (feat: add Strava widget integration and comprehensive E2E test suite)
import { UserService } from "@/services/UserService";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";

export default async function Home() {
  const session = await auth();

  // Get the user's current challenge and settings if signed in
  let challengeTitle: string | null = null;
  let daysCount: number | null = null;
  let userZipCode: string | null = null;
  let completedPositions: number[] = [];
  let coldestRun: ColdestRunInfo | null = null;
  let leaderboard: LeaderboardEntry[] = [];
  let stravaUrl: string | null = null;
  
  // Always fetch active challenges and all-time record for public display
  const [activeChallenges, allTimeRecord] = await Promise.all([
    ChallengeService.getActiveChallengesWithLeaderboards(),
    ChallengeService.getAllTimeRecord(),
  ]);
  
  if (session?.user?.id) {
    const [userChallenge, user, coldest, leaders] = await Promise.all([
      ChallengeService.getUserCurrentChallenge(session.user.id),
      UserService.findById(session.user.id),
      ChallengeService.getColdestRun(session.user.id),
      ChallengeService.getChallengeLeaderboard(),
    ]);
    if (userChallenge) {
      challengeTitle = ChallengeService.formatChallengeTitle(
        userChallenge.challenge
      );
      daysCount = userChallenge.daysCount;
      completedPositions = userChallenge.runs.map((run) => run.position);
      stravaUrl = userChallenge.challenge.stravaUrl;
    }
    if (user) {
      userZipCode = user.zipCode;
    }
    coldestRun = coldest;
    leaderboard = leaders;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            NNRC
          </span>
          {session?.user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                {session.user.name || session.user.email}
              </span>
              {isAdmin(session.user.role) && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors duration-150"
                >
                  Admin
                </Link>
              )}
              <SettingsModal currentZipCode={userZipCode} />
              {session.user.image && (
                <Avatar
                  src={session.user.image}
                  alt=""
                  size={32}
                  className="ring-2 ring-gray-100"
                />
              )}
              <SignOutButton />
            </div>
          ) : (
            <SignInModal />
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {session?.user && challengeTitle && daysCount ? (
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-1">
              <ChallengeCard
                title={challengeTitle}
                daysCount={daysCount}
                completedPositions={completedPositions}
              />
            </div>
            <div className="w-full md:w-52 space-y-4">
              {stravaUrl && (
                <StravaWidget stravaUrl={stravaUrl} />
              )}
              {coldestRun && (
                <ColdestRunWidget
                  temperature={coldestRun.temperature}
                  date={coldestRun.date}
                  runNumber={coldestRun.position}
                />
              )}
              {leaderboard.length > 0 && (
                <LeaderboardWidget entries={leaderboard} />
              )}
              {allTimeRecord && (
                <AllTimeRecordWidget
                  name={allTimeRecord.name}
                  temperature={allTimeRecord.temperature}
                  image={allTimeRecord.image}
                />
              )}
            </div>
          </div>
        ) : (
          <>
            <header className="mb-16 pt-12 text-center">
              <h1 className="mb-4 text-5xl font-black tracking-tight text-gray-900">
                No Name Running Club
              </h1>
              <p className="text-xl text-gray-500">
                Run together. No name needed.
              </p>
            </header>

            {/* Two-column grid: Currently Running + Club Records */}
            <section className="mb-12 grid gap-8 md:grid-cols-2">
              {/* Currently Running - Left Column */}
              <div>
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Currently Running
                </h2>
                {activeChallenges.length > 0 ? (
                  <div className="space-y-6">
                    {activeChallenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        className="rounded-xl bg-white p-6 shadow-card"
                      >
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                          {challenge.title}
                        </h3>
                        {challenge.leaderboard.length > 0 ? (
                          <LeaderboardWidget entries={challenge.leaderboard} />
                        ) : (
                          <p className="text-sm text-gray-400">
                            No runs recorded yet. Be the first to log a run!
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-white p-6 shadow-card">
                    <p className="text-sm text-gray-400">
                      No active challenges right now.
                    </p>
                  </div>
                )}
              </div>

              {/* Club Records - Right Column */}
              <div>
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Club Records
                </h2>
                {allTimeRecord ? (
                  <AllTimeRecordWidget
                    name={allTimeRecord.name}
                    temperature={allTimeRecord.temperature}
                    image={allTimeRecord.image}
                  />
                ) : (
                  <div className="rounded-xl bg-white p-6 shadow-card">
                    <p className="text-sm text-gray-400">
                      No records yet.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <ShareWidget />
          </>
        )}
      </main>
    </div>
  );
}
