import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ExportButtons from "./ExportButtons";

interface PageProps {
  searchParams: Promise<{ challengeId?: string }>;
}

export default async function ExportPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const challenges = await prisma.challenge.findMany({
    orderBy: [{ year: "desc" }, { season: "asc" }],
    select: { id: true, season: true, year: true, current: true },
  });

  const selectedChallengeId = params.challengeId || challenges.find((c) => c.current)?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/analytics"
          className="text-nnrc-purple hover:text-nnrc-purple-dark"
        >
          ← Back to Analytics
        </Link>
        <h1 className="text-2xl font-bold text-nnrc-purple-dark">Export Data</h1>
      </div>

      {/* Export Options */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Export */}
        <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
            Export Users
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Export all users with their challenge participation and run statistics.
          </p>
          <ExportButtons type="users" />
        </div>

        {/* Challenge Export */}
        <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
            Export Challenge Data
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Export all runs and participant data for a specific challenge.
          </p>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Challenge
            </label>
            <form>
              <select
                name="challengeId"
                defaultValue={selectedChallengeId}
                className="w-full rounded-lg border border-nnrc-lavender bg-white px-3 py-2 text-sm focus:border-nnrc-purple focus:outline-none"
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("challengeId", e.target.value);
                  window.location.href = url.toString();
                }}
              >
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.season.charAt(0).toUpperCase() + c.season.slice(1)} {c.year}
                    {c.current ? " (Current)" : ""}
                  </option>
                ))}
              </select>
            </form>
          </div>
          {selectedChallengeId && (
            <ExportButtons type="challenge" challengeId={selectedChallengeId} />
          )}
        </div>

        {/* Leaderboard Export */}
        <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
            Export Leaderboard
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Export the leaderboard rankings for a challenge, including run counts
            and temperature stats.
          </p>
          {selectedChallengeId && (
            <ExportButtons type="leaderboard" challengeId={selectedChallengeId} />
          )}
        </div>

        {/* All Challenges Stats */}
        <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
            Export All Challenge Stats
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Export participation statistics for all challenges.
          </p>
          <ExportButtons type="allChallenges" />
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl bg-nnrc-lavender-light border border-nnrc-lavender p-6">
        <h3 className="mb-2 font-semibold text-nnrc-purple-dark">
          Export Formats
        </h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <strong>CSV:</strong> Compatible with Excel, Google Sheets, and other
            spreadsheet applications.
          </li>
          <li>
            <strong>JSON:</strong> Machine-readable format for data analysis and
            integrations.
          </li>
        </ul>
      </div>
    </div>
  );
}
