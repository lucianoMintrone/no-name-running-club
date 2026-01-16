import { AnalyticsService } from "@/services/AnalyticsService";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  AnalyticsHelpPanel,
  AnalyticsStatCard,
  EngagementCard,
  ChallengeStatCard,
  ChartTitleWithHelp,
  analyticsHelp,
} from "./AnalyticsHelp";

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

      <AnalyticsHelpPanel />

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <AnalyticsStatCard
          title="Total Users"
          value={data.overview.totalUsers}
          helpText={analyticsHelp.overviewStats.totalUsers}
        />
        <AnalyticsStatCard
          title="Total Runs"
          value={data.overview.totalRuns}
          helpText={analyticsHelp.overviewStats.totalRuns}
        />
        <AnalyticsStatCard
          title="Challenges"
          value={data.overview.totalChallenges}
          helpText={analyticsHelp.overviewStats.challenges}
        />
        <AnalyticsStatCard
          title="Avg Runs/User"
          value={data.overview.averageRunsPerUser}
          helpText={analyticsHelp.overviewStats.avgRunsPerUser}
        />
        <AnalyticsStatCard
          title="New Users (Month)"
          value={data.overview.userGrowthThisMonth}
          helpText={analyticsHelp.overviewStats.newUsersMonth}
          highlight
        />
        <AnalyticsStatCard
          title="Runs (Month)"
          value={data.overview.runsThisMonth}
          helpText={analyticsHelp.overviewStats.runsMonth}
          highlight
        />
      </div>

      {/* User Engagement */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
          User Engagement
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <EngagementCard
            label="Active Users (7 days)"
            value={data.engagement.activeUsersLast7Days}
            helpText={analyticsHelp.engagement.activeUsers7Days}
          />
          <EngagementCard
            label="Active Users (30 days)"
            value={data.engagement.activeUsersLast30Days}
            helpText={analyticsHelp.engagement.activeUsers30Days}
          />
          <EngagementCard
            label="New Users (7 days)"
            value={data.engagement.newUsersLast7Days}
            helpText={analyticsHelp.engagement.newUsers7Days}
          />
          <EngagementCard
            label="New Users (30 days)"
            value={data.engagement.newUsersLast30Days}
            helpText={analyticsHelp.engagement.newUsers30Days}
          />
          <EngagementCard
            label="Runs (7 days)"
            value={data.engagement.runsLast7Days}
            helpText={analyticsHelp.engagement.runs7Days}
          />
          <EngagementCard
            label="Runs (30 days)"
            value={data.engagement.runsLast30Days}
            helpText={analyticsHelp.engagement.runs30Days}
          />
        </div>
      </div>

      {/* Current Challenge Stats */}
      {data.currentChallengeStats && (
        <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
            Current Challenge: {data.currentChallengeStats.challengeName}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ChallengeStatCard
              label="Participants"
              value={data.currentChallengeStats.totalParticipants}
              helpText={analyticsHelp.currentChallenge.participants}
            />
            <ChallengeStatCard
              label="Total Runs"
              value={data.currentChallengeStats.totalRuns}
              helpText={analyticsHelp.currentChallenge.totalRuns}
            />
            <ChallengeStatCard
              label="Completion Rate"
              value={`${data.currentChallengeStats.completionRate}%`}
              subtext={`${data.currentChallengeStats.completedUsers} of ${data.currentChallengeStats.totalParticipants} completed`}
              helpText={analyticsHelp.currentChallenge.completionRate}
            />
            <ChallengeStatCard
              label="Coldest Run"
              value={
                data.currentChallengeStats.coldestRun !== null
                  ? `${data.currentChallengeStats.coldestRun}°F`
                  : "N/A"
              }
              subtext={
                data.currentChallengeStats.averageTemperature !== null
                  ? `Avg: ${data.currentChallengeStats.averageTemperature}°F`
                  : undefined
              }
              helpText={analyticsHelp.currentChallenge.coldestRun}
            />
          </div>
        </div>
      )}

      {/* Runs Per Day Chart */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <ChartTitleWithHelp helpText={analyticsHelp.charts.runsPerDay}>
          Runs Per Day (Last 30 Days)
        </ChartTitleWithHelp>
        <div className="h-48">
          <div className="flex h-full items-end gap-1">
            {data.runsByDay.map((day) => (
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
        <div className="mb-4 flex items-center">
          <ChartTitleWithHelp helpText={analyticsHelp.charts.temperatureDistribution}>
            Temperature Distribution
          </ChartTitleWithHelp>
          {data.currentChallengeStats && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({data.currentChallengeStats.challengeName})
            </span>
          )}
        </div>
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
