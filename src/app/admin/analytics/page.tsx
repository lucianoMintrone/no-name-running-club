import { AnalyticsService } from "@/services/AnalyticsService";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getAnalyticsData() {
  const [overview, engagement, runsByDay, challenges] = await Promise.all([
    AnalyticsService.getOverviewStats(),
    AnalyticsService.getUserEngagement(),
    AnalyticsService.getRunsByDay(30),
    prisma.challenge.findMany({
      orderBy: [{ year: "desc" }, { season: "asc" }],
      select: { id: true, season: true, year: true, current: true },
    }),
  ]);

  // Get participation for current challenge if exists
  const currentChallenge = challenges.find((c) => c.current);
  const currentChallengeStats = currentChallenge
    ? await AnalyticsService.getChallengeParticipation(currentChallenge.id)
    : null;

  // Get temperature distribution for current challenge
  const tempDistribution = currentChallenge
    ? await AnalyticsService.getTemperatureDistribution(currentChallenge.id)
    : await AnalyticsService.getTemperatureDistribution();

  return {
    overview,
    engagement,
    runsByDay,
    challenges,
    currentChallengeStats,
    tempDistribution,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  // Calculate max for chart scaling
  const maxRunsPerDay = Math.max(...data.runsByDay.map((d) => d.count), 1);
  const maxTempCount = Math.max(...data.tempDistribution.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-nnrc-purple-dark">
          Analytics & Reporting
        </h1>
        <div className="flex gap-2">
          <Link
            href="/admin/analytics/export"
            className="rounded-lg bg-nnrc-purple px-4 py-2 text-sm text-white hover:bg-nnrc-purple-dark"
          >
            Export Data
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Total Users" value={data.overview.totalUsers} />
        <StatCard title="Total Runs" value={data.overview.totalRuns} />
        <StatCard title="Challenges" value={data.overview.totalChallenges} />
        <StatCard
          title="Avg Runs/User"
          value={data.overview.averageRunsPerUser}
        />
        <StatCard
          title="New Users (Month)"
          value={data.overview.userGrowthThisMonth}
          highlight
        />
        <StatCard
          title="Runs (Month)"
          value={data.overview.runsThisMonth}
          highlight
        />
      </div>

      {/* User Engagement */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
          User Engagement
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-nnrc-lavender-light p-4">
            <p className="text-sm text-gray-500">Active Users (7 days)</p>
            <p className="text-2xl font-bold text-nnrc-purple-dark">
              {data.engagement.activeUsersLast7Days}
            </p>
          </div>
          <div className="rounded-lg bg-nnrc-lavender-light p-4">
            <p className="text-sm text-gray-500">Active Users (30 days)</p>
            <p className="text-2xl font-bold text-nnrc-purple-dark">
              {data.engagement.activeUsersLast30Days}
            </p>
          </div>
          <div className="rounded-lg bg-nnrc-lavender-light p-4">
            <p className="text-sm text-gray-500">New Users (7 days)</p>
            <p className="text-2xl font-bold text-nnrc-purple-dark">
              {data.engagement.newUsersLast7Days}
            </p>
          </div>
          <div className="rounded-lg bg-nnrc-lavender-light p-4">
            <p className="text-sm text-gray-500">New Users (30 days)</p>
            <p className="text-2xl font-bold text-nnrc-purple-dark">
              {data.engagement.newUsersLast30Days}
            </p>
          </div>
          <div className="rounded-lg bg-nnrc-lavender-light p-4">
            <p className="text-sm text-gray-500">Runs (7 days)</p>
            <p className="text-2xl font-bold text-nnrc-purple-dark">
              {data.engagement.runsLast7Days}
            </p>
          </div>
          <div className="rounded-lg bg-nnrc-lavender-light p-4">
            <p className="text-sm text-gray-500">Runs (30 days)</p>
            <p className="text-2xl font-bold text-nnrc-purple-dark">
              {data.engagement.runsLast30Days}
            </p>
          </div>
        </div>
      </div>

      {/* Current Challenge Stats */}
      {data.currentChallengeStats && (
        <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
            Current Challenge: {data.currentChallengeStats.challengeName}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-nnrc-lavender-light p-4">
              <p className="text-sm text-gray-500">Participants</p>
              <p className="text-2xl font-bold text-nnrc-purple-dark">
                {data.currentChallengeStats.totalParticipants}
              </p>
            </div>
            <div className="rounded-lg bg-nnrc-lavender-light p-4">
              <p className="text-sm text-gray-500">Total Runs</p>
              <p className="text-2xl font-bold text-nnrc-purple-dark">
                {data.currentChallengeStats.totalRuns}
              </p>
            </div>
            <div className="rounded-lg bg-nnrc-lavender-light p-4">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-nnrc-purple-dark">
                {data.currentChallengeStats.completionRate}%
              </p>
              <p className="text-xs text-gray-400">
                {data.currentChallengeStats.completedUsers} of{" "}
                {data.currentChallengeStats.totalParticipants} completed
              </p>
            </div>
            <div className="rounded-lg bg-nnrc-lavender-light p-4">
              <p className="text-sm text-gray-500">Coldest Run</p>
              <p className="text-2xl font-bold text-nnrc-purple-dark">
                {data.currentChallengeStats.coldestRun !== null
                  ? `${data.currentChallengeStats.coldestRun}°F`
                  : "N/A"}
              </p>
              {data.currentChallengeStats.averageTemperature !== null && (
                <p className="text-xs text-gray-400">
                  Avg: {data.currentChallengeStats.averageTemperature}°F
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Runs Per Day Chart */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
          Runs Per Day (Last 30 Days)
        </h2>
        <div className="h-48">
          <div className="flex h-full items-end gap-1">
            {data.runsByDay.map((day, index) => (
              <div
                key={day.date}
                className="group relative flex-1 min-w-0"
                title={`${day.date}: ${day.count} runs`}
              >
                <div
                  className="w-full bg-nnrc-purple hover:bg-nnrc-purple-dark transition-colors rounded-t"
                  style={{
                    height: `${(day.count / maxRunsPerDay) * 100}%`,
                    minHeight: day.count > 0 ? "4px" : "0",
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    : {day.count} runs
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>
            {data.runsByDay.length > 0
              ? new Date(data.runsByDay[0].date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
          <span>
            {data.runsByDay.length > 0
              ? new Date(
                  data.runsByDay[data.runsByDay.length - 1].date
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>
      </div>

      {/* Temperature Distribution */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
          Temperature Distribution
          {data.currentChallengeStats && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({data.currentChallengeStats.challengeName})
            </span>
          )}
        </h2>
        {data.tempDistribution.length > 0 ? (
          <div className="space-y-2">
            {data.tempDistribution.map((bucket) => (
              <div key={bucket.range} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600 text-right">
                  {bucket.range}
                </div>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded"
                    style={{
                      width: `${(bucket.count / maxTempCount) * 100}%`,
                    }}
                  />
                </div>
                <div className="w-12 text-sm text-gray-600">{bucket.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No temperature data available</p>
        )}
      </div>

      {/* Challenge Comparison */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
          All Challenges
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nnrc-lavender text-left">
                <th className="pb-2 font-medium text-gray-500">Challenge</th>
                <th className="pb-2 font-medium text-gray-500">Status</th>
                <th className="pb-2 font-medium text-gray-500 text-right">
                  Participants
                </th>
                <th className="pb-2 font-medium text-gray-500 text-right">
                  Total Runs
                </th>
                <th className="pb-2 font-medium text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.challenges.map((challenge) => (
                <ChallengeRow key={challenge.id} challenge={challenge} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

async function ChallengeRow({
  challenge,
}: {
  challenge: { id: string; season: string; year: string; current: boolean };
}) {
  const stats = await AnalyticsService.getChallengeParticipation(challenge.id);

  return (
    <tr className="border-b border-nnrc-lavender-light">
      <td className="py-3 text-nnrc-purple-dark font-medium">
        {challenge.season.charAt(0).toUpperCase() + challenge.season.slice(1)}{" "}
        {challenge.year}
      </td>
      <td className="py-3">
        {challenge.current ? (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
            Active
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
            Past
          </span>
        )}
      </td>
      <td className="py-3 text-right">{stats?.totalParticipants || 0}</td>
      <td className="py-3 text-right">{stats?.totalRuns || 0}</td>
      <td className="py-3 text-right">
        <Link
          href={`/admin/analytics/export?challengeId=${challenge.id}`}
          className="text-nnrc-purple hover:text-nnrc-purple-dark text-xs"
        >
          Export
        </Link>
      </td>
    </tr>
  );
}

function StatCard({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-md ${
        highlight
          ? "bg-nnrc-purple-light border-nnrc-purple"
          : "bg-white border-nnrc-lavender"
      }`}
    >
      <p className={`text-xs ${highlight ? "text-white/80" : "text-gray-500"}`}>
        {title}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${
          highlight ? "text-white" : "text-nnrc-purple-dark"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
