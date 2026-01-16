import { requireAdmin } from "@/lib/admin";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to home if not admin
  await requireAdmin();

  return (
    <div className="min-h-screen bg-nnrc-lavender-light">
      {/* Admin Header */}
      <header className="bg-nnrc-purple-dark text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xl font-bold">
              NNRC Admin
            </Link>
            <span className="rounded bg-nnrc-purple px-2 py-1 text-xs">
              Dashboard
            </span>
          </div>
          <Link
            href="/"
            className="text-sm text-nnrc-lavender-light hover:text-white"
          >
            ← Back to Site
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar Navigation */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-nnrc-lavender p-4">
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Overview
            </Link>
            <Link
              href="/admin/challenges"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Challenges
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Users
            </Link>
            <Link
              href="/admin/runs"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Runs
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analytics
            </Link>
            <Link
              href="/admin/feedback"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-nnrc-purple-dark hover:bg-nnrc-lavender-light"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h6m5 8l-4-4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
                />
              </svg>
              Feedback
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
