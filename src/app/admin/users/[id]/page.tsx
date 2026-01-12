import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UserActions } from "./UserActions";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userChallenges: {
        include: {
          challenge: true,
          runs: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const allChallenges = await prisma.challenge.findMany({
    orderBy: { createdAt: "desc" },
  });

  const enrolledChallengeIds = user.userChallenges.map((uc) => uc.challengeId);
  const availableChallenges = allChallenges.filter(
    (c) => !enrolledChallengeIds.includes(c.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a
          href="/admin/users"
          className="text-nnrc-purple hover:text-nnrc-purple-dark"
        >
          ← Back
        </a>
        <h1 className="text-2xl font-bold text-nnrc-purple-dark">User Details</h1>
      </div>

      {/* User Info Card */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <div className="flex items-start gap-6">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-20 w-20 rounded-full"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-nnrc-purple-light flex items-center justify-center text-white text-2xl font-medium">
              {(user.name || user.email)?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-nnrc-purple-dark">
              {user.name || "No name set"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>Units: {user.units}</span>
              {user.zipCode && <span>Zip: {user.zipCode}</span>}
              <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            {user.role === "admin" ? (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                Admin
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                Member
              </span>
            )}
          </div>
        </div>

        <UserActions
          userId={user.id}
          currentRole={user.role}
          availableChallenges={availableChallenges}
        />
      </div>

      {/* Enrolled Challenges */}
      <div className="rounded-xl bg-white border border-nnrc-lavender p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-nnrc-purple-dark">
          Enrolled Challenges
        </h3>
        {user.userChallenges.length > 0 ? (
          <div className="space-y-4">
            {user.userChallenges.map((uc) => (
              <div
                key={uc.id}
                className="rounded-lg border border-nnrc-lavender p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-nnrc-purple-dark">
                      {uc.challenge.season.charAt(0).toUpperCase() +
                        uc.challenge.season.slice(1)}{" "}
                      {uc.challenge.year}
                    </p>
                    <p className="text-sm text-gray-500">
                      {uc.runs.length} of {uc.daysCount} runs logged
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {uc.challenge.current && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                {uc.runs.length > 0 && (
                  <div className="mt-3 border-t border-nnrc-lavender pt-3">
                    <p className="text-xs text-gray-500 mb-2">Runs:</p>
                    <div className="flex flex-wrap gap-2">
                      {uc.runs.map((run) => (
                        <span
                          key={run.id}
                          className="rounded bg-nnrc-lavender-light px-2 py-1 text-xs text-nnrc-purple-dark"
                        >
                          #{run.position}: {run.temperature}°F
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Not enrolled in any challenges.</p>
        )}
      </div>
    </div>
  );
}
