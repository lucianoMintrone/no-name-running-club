import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { retryFeedbackLinearIssue } from "@/app/actions/feedback";
import { Badge, Button, Card } from "@/components/ui";

type SearchParams = {
  status?: "created" | "failed" | "pending";
  category?: "bug" | "idea" | "question";
  q?: string;
};

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const status = sp.status;
  const category = sp.category;
  const q = sp.q?.trim();

  const feedback = await prisma.feedback.findMany({
    where: {
      ...(status ? { linearStatus: status } : {}),
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { message: { contains: q, mode: "insensitive" } },
              { user: { email: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { email: true, name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-nnrc-purple-dark">Feedback</h1>
          <p className="mt-1 text-sm text-gray-600">
            Logged-in submissions. Each item attempts to create a Linear issue (team COA).
          </p>
        </div>

        <Link
          href="/admin/feedback"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-nnrc-purple-dark shadow-sm ring-1 ring-nnrc-lavender hover:bg-nnrc-lavender-light transition-colors"
        >
          Clear filters
        </Link>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-card">
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Status</label>
            <select
              name="status"
              defaultValue={status ?? ""}
              className="mt-1 w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-nnrc-purple focus:outline-none transition-all"
            >
              <option value="">All</option>
              <option value="created">Created</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">Category</label>
            <select
              name="category"
              defaultValue={category ?? ""}
              className="mt-1 w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-nnrc-purple focus:outline-none transition-all"
            >
              <option value="">All</option>
              <option value="idea">Idea</option>
              <option value="bug">Bug</option>
              <option value="question">Question</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">Search</label>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="message or user email"
              className="mt-1 w-full rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-nnrc-purple focus:outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-3 flex items-center justify-end gap-2 pt-1">
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-nnrc-lavender px-5 py-4">
          <div className="text-sm font-semibold text-gray-900">
            Latest submissions <span className="text-gray-500">({feedback.length})</span>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No feedback matches your filters.
          </div>
        ) : (
          <div className="divide-y divide-nnrc-lavender">
            {feedback.map((f) => (
              <div key={f.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={f.linearStatus === "created" ? "success" : f.linearStatus === "failed" ? "danger" : "neutral"}>
                        {f.linearStatus.toUpperCase()}
                      </Badge>
                      <Badge tone="nnrc">{f.category.toUpperCase()}</Badge>
                      <span className="text-xs text-gray-500">
                        {f.createdAt.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-900 whitespace-pre-wrap break-words">
                      {f.message}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        User:{" "}
                        <span className="font-medium text-gray-700">
                          {f.user.email}
                        </span>
                        {f.user.name ? ` (${f.user.name})` : ""}
                      </span>
                      {f.pagePath ? <span>Page: {f.pagePath}</span> : null}
                      {f.linearIssueUrl ? (
                        <a
                          href={f.linearIssueUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-nnrc-purple-dark hover:underline"
                        >
                          Open in Linear →
                        </a>
                      ) : null}
                    </div>

                    {f.linearStatus === "failed" && f.linearError ? (
                      <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">
                        {f.linearError}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {f.linearStatus !== "created" ? (
                      <form action={retryFeedbackLinearIssue.bind(null, f.id)}>
                        <Button type="submit" variant="secondary" size="sm">
                          Retry Linear
                        </Button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

