import { auth } from "@/lib/auth";
import { signOutUser } from "@/app/actions/auth";
import { SignInModal } from "@/components/SignInModal";
import { SettingsModal } from "@/components/SettingsModal";
import { ChallengeCard } from "@/components/ChallengeCard";
import { ColdestRunWidget } from "@/components/ColdestRunWidget";
import { LeaderboardWidget } from "@/components/LeaderboardWidget";
import { AllTimeRecordWidget } from "@/components/AllTimeRecordWidget";
import { ChallengeService, type ColdestRunInfo, type LeaderboardEntry, type ActiveChallengeWithLeaderboard, type AllTimeRecord } from "@/services/ChallengeService";
import { UserService } from "@/services/UserService";

export default async function Home() {
  const session = await auth();

  // Get the user's current challenge and settings if signed in
  let challengeTitle: string | null = null;
  let daysCount: number | null = null;
  let userUnits: string = "imperial";
  let userZipCode: string | null = null;
  let completedPositions: number[] = [];
  let coldestRun: ColdestRunInfo | null = null;
  let leaderboard: LeaderboardEntry[] = [];
  
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
    }
    if (user) {
      userUnits = user.units;
      userZipCode = user.zipCode;
    }
    coldestRun = coldest;
    leaderboard = leaders;
  }

  return (
    <div className="min-h-screen bg-nnrc-lavender-light">
      <nav className="border-b border-nnrc-lavender bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-bold text-nnrc-purple-dark text-lg">
            NNRC
          </span>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.name || session.user.email}
              </span>
              <SettingsModal currentUnits={userUnits} currentZipCode={userZipCode} />
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-nnrc-lavender"
                />
              )}
              <form action={signOutUser}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-nnrc-lavender px-4 py-2 text-sm font-medium text-nnrc-purple-dark hover:bg-nnrc-lavender-dark transition-colors duration-200"
                >
                  Sign out
                </button>
              </form>
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
                units={userUnits}
                completedPositions={completedPositions}
              />
            </div>
            <div className="w-full md:w-52 space-y-4">
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
            <header className="mb-16 pt-8 text-center">
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-nnrc-purple-dark">
                No Name Running Club
              </h1>
              <p className="text-xl text-nnrc-purple">
                Run together. No name needed.
              </p>
            </header>

            {/* Two-column grid: Currently Running + Club Records */}
            <section className="mb-12 grid gap-8 md:grid-cols-2">
              {/* Currently Running - Left Column */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-nnrc-purple-dark">
                  Currently Running
                </h2>
                {activeChallenges.length > 0 ? (
                  <div className="space-y-6">
                    {activeChallenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        className="rounded-2xl bg-white border-2 border-nnrc-lavender p-6 shadow-md"
                      >
                        <h3 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
                          {challenge.title}
                        </h3>
                        {challenge.leaderboard.length > 0 ? (
                          <LeaderboardWidget entries={challenge.leaderboard} />
                        ) : (
                          <p className="text-sm text-gray-500">
                            No runs recorded yet. Be the first to log a run!
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white border-2 border-nnrc-lavender p-6 shadow-md">
                    <p className="text-sm text-gray-500">
                      No active challenges right now.
                    </p>
                  </div>
                )}
              </div>

              {/* Club Records - Right Column */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-nnrc-purple-dark">
                  Club Records
                </h2>
                {allTimeRecord ? (
                  <AllTimeRecordWidget
                    name={allTimeRecord.name}
                    temperature={allTimeRecord.temperature}
                    image={allTimeRecord.image}
                  />
                ) : (
                  <div className="rounded-2xl bg-white border-2 border-nnrc-lavender p-6 shadow-md">
                    <p className="text-sm text-gray-500">
                      No records yet.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-white border-2 border-nnrc-lavender p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="mb-3 text-xl font-semibold text-nnrc-purple-dark">
                  Community Runs
                </h2>
                <p className="text-gray-600">
                  Join weekly group runs with runners of all levels.
                </p>
              </div>

              <div className="rounded-2xl bg-white border-2 border-nnrc-lavender p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="mb-3 text-xl font-semibold text-nnrc-purple-dark">
                  Events
                </h2>
                <p className="text-gray-600">
                  Races, social events, and everything in between.
                </p>
              </div>

              <div className="rounded-2xl bg-white border-2 border-nnrc-lavender p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="mb-3 text-xl font-semibold text-nnrc-purple-dark">
                  Connect
                </h2>
                <p className="text-gray-600">
                  Meet fellow runners and build lasting friendships.
                </p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
