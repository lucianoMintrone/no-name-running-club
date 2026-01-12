import { auth } from "@/lib/auth";
import { signOutUser } from "@/app/actions/auth";
import { SignInModal } from "@/components/SignInModal";
import { SettingsModal } from "@/components/SettingsModal";
import { ChallengeCard } from "@/components/ChallengeCard";
import { ColdestRunWidget } from "@/components/ColdestRunWidget";
import { LeaderboardWidget } from "@/components/LeaderboardWidget";
import { AllTimeRecordWidget } from "@/components/AllTimeRecordWidget";
import { ChallengeService, type ColdestRunInfo, type LeaderboardEntry } from "@/services/ChallengeService";
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            NNRC
          </span>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {session.user.name || session.user.email}
              </span>
              <SettingsModal currentUnits={userUnits} currentZipCode={userZipCode} />
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
              )}
              <form action={signOutUser}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
                userAvatar={session.user.image || undefined}
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
              <AllTimeRecordWidget name="Isaac Stoner" temperature={-30} />
            </div>
          </div>
        ) : (
          <>
            <header className="mb-16 pt-8 text-center">
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                No Name Running Club
              </h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                Run together. No name needed.
              </p>
            </header>

            <section className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Community Runs
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Join weekly group runs with runners of all levels.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Events
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Races, social events, and everything in between.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
                <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Connect
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
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
