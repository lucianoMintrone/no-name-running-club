import { prisma } from "@/lib/prisma";

async function getAdminStats() {
  const [
    totalUsers,
    totalRuns,
    totalChallenges,
    currentChallenge,
    recentRuns,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.run.count(),
    prisma.challenge.count(),
    prisma.challenge.findFirst({
      where: { current: true },
      include: {
        userChallenges: {
          include: {
            _count: { select: { runs: true } },
          },
        },
      },
    }),
    prisma.run.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        userChallenge: {
          include: {
            user: { select: { name: true, email: true, image: true } },
            challenge: { select: { season: true, year: true } },
          },
        },
      },
    }),
  ]);

  const currentChallengeParticipants = currentChallenge?.userChallenges.length || 0;
  const currentChallengeRuns = currentChallenge?.userChallenges.reduce(
    (acc, uc) => acc + uc._count.runs,
    0
  ) || 0;

  return {
    totalUsers,
    totalRuns,
    totalChallenges,
    currentChallenge,
    currentChallengeParticipants,
    currentChallengeRuns,
    recentRuns,
  };
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-nnrc-purple-dark">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Runs"
          value={stats.totalRuns}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          title="Challenges"
          value={stats.totalChallenges}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Active Participants"
          value={stats.currentChallengeParticipants}
          icon={
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Current Challenge Info */}
      {stats.currentChallenge && (
        <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
            Current Challenge
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Challenge</p>
              <p className="text-lg font-medium text-nnrc-purple-dark">
                {stats.currentChallenge.season.charAt(0).toUpperCase() +
                  stats.currentChallenge.season.slice(1)}{" "}
                {stats.currentChallenge.year}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="text-lg font-medium text-nnrc-purple-dark">
                {stats.currentChallengeParticipants}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Runs</p>
              <p className="text-lg font-medium text-nnrc-purple-dark">
                {stats.currentChallengeRuns}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
          Recent Activity
        </h2>
        {stats.recentRuns.length > 0 ? (
          <div className="space-y-3">
            {stats.recentRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between rounded-lg bg-nnrc-lavender-light p-3"
              >
                <div className="flex items-center gap-3">
                  {run.userChallenge.user.image ? (
                    <img
                      src={run.userChallenge.user.image}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-nnrc-purple-light" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-nnrc-purple-dark">
                      {run.userChallenge.user.name || run.userChallenge.user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Run #{run.position} • {run.temperature}°F
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(run.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-nnrc-purple-dark">{value}</p>
        </div>
        <div className="text-nnrc-purple">{icon}</div>
      </div>
    </div>
  );
}
