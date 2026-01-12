import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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
          User Management
        </h1>
        <div className="text-sm text-gray-500">
          {users.length} total users
        </div>
      </div>

      {/* Users List */}
      <div className="rounded-xl bg-white border border-nnrc-lavender shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-nnrc-lavender-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Challenges
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Total Runs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-nnrc-purple-dark uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nnrc-lavender">
            {users.map((user) => {
              const totalRuns = user.userChallenges.reduce(
                (acc, uc) => acc + uc._count.runs,
                0
              );
              return (
                <tr key={user.id} className="hover:bg-nnrc-lavender-light/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-nnrc-purple-light flex items-center justify-center text-white font-medium">
                          {(user.name || user.email)?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-nnrc-purple-dark">
                          {user.name || "No name"}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Member
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user._count.userChallenges}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {totalRuns}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-nnrc-purple hover:text-nnrc-purple-dark"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
}
