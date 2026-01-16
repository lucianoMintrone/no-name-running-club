import { prisma } from "@/lib/prisma";
import { RunActions } from "./RunActions";
import { RunsHelpPanel, RunTableHeader } from "./RunsHelp";
import { Avatar } from "@/components/Avatar";

export default async function AdminRunsPage() {
  const runs = await prisma.run.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      userChallenge: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          challenge: { select: { season: true, year: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-nnrc-purple-dark">
          Run Moderation
        </h1>
        <div className="text-sm text-gray-500">
          Showing latest {runs.length} runs
        </div>
      </div>

      <RunsHelpPanel />

      {/* Runs List */}
      <div className="rounded-xl bg-white border border-nnrc-lavender shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-nnrc-lavender-light">
            <tr>
              <RunTableHeader field="user">User</RunTableHeader>
              <RunTableHeader field="challenge">Challenge</RunTableHeader>
              <RunTableHeader field="runNumber">Run #</RunTableHeader>
              <RunTableHeader field="temperature">Temperature</RunTableHeader>
              <RunTableHeader field="date">Date</RunTableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nnrc-lavender">
            {runs.map((run) => {
              const isSuspicious =
                run.temperature !== null && run.temperature < -20;
              return (
                <tr
                  key={run.id}
                  className={`hover:bg-nnrc-lavender-light/50 ${
                    isSuspicious ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={run.userChallenge.user.image}
                        alt=""
                        size={32}
                        className="h-8 w-8 text-xs"
                        fallbackText={run.userChallenge.user.name || run.userChallenge.user.email || "?"}
                      />
                      <div>
                        <div className="text-sm font-medium text-nnrc-purple-dark">
                          {run.userChallenge.user.name || "No name"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {run.userChallenge.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {run.userChallenge.challenge.season.charAt(0).toUpperCase() +
                      run.userChallenge.challenge.season.slice(1)}{" "}
                    {run.userChallenge.challenge.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    #{run.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        isSuspicious ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {run.temperature}°F
                      {isSuspicious && (
                        <span className="ml-2 text-xs text-red-500">
                          ⚠️ Suspicious
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(run.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <RunActions runId={run.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {runs.length === 0 && (
          <div className="p-6 text-center text-gray-500">No runs found.</div>
        )}
      </div>
    </div>
  );
}
