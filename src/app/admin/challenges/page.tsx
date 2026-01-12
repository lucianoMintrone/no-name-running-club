import { prisma } from "@/lib/prisma";
import { ChallengeService } from "@/services/ChallengeService";

export default async function AdminChallengesPage() {
  const challenges = await prisma.challenge.findMany({
    orderBy: [{ current: "desc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: { userChallenges: true },
      },
      userChallenges: {
        include: {
          _count: { select: { runs: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-nnrc-purple-dark">
          Challenge Management
        </h1>
        <a
          href="/admin/challenges/new"
          className="rounded-lg bg-nnrc-purple px-4 py-2 text-white hover:bg-nnrc-purple-dark"
        >
          + New Challenge
        </a>
      </div>

      {/* Challenges List */}
      <div className="rounded-xl bg-white border border-nnrc-lavender shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-nnrc-lavender-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Challenge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Runs
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nnrc-lavender">
            {challenges.map((challenge) => {
              const totalRuns = challenge.userChallenges.reduce(
                (acc, uc) => acc + uc._count.runs,
                0
              );
              return (
                <tr key={challenge.id} className="hover:bg-nnrc-lavender-light/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-nnrc-purple-dark">
                      {ChallengeService.formatChallengeTitle(challenge)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {new Date(challenge.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {challenge.current ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {challenge.daysCount} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {challenge._count.userChallenges}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {totalRuns}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <a
                      href={`/admin/challenges/${challenge.id}`}
                      className="text-nnrc-purple hover:text-nnrc-purple-dark mr-3"
                    >
                      Edit
                    </a>
                    {!challenge.current && (
                      <form
                        action={`/api/admin/challenges/${challenge.id}/set-current`}
                        method="POST"
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="text-green-600 hover:text-green-800"
                        >
                          Set Active
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {challenges.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No challenges created yet.
          </div>
        )}
      </div>
    </div>
  );
}
