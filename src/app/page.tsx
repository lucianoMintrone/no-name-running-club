import { auth } from "@/lib/auth";
import { signOutUser } from "@/app/actions/auth";
import { SignInModal } from "@/components/SignInModal";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            NNRC
          </span>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {session.user.name || session.user.email}
              </span>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
              )}
              <form action={signOutUser}>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <SignInModal />
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            No Name Running Club
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Run together. No name needed.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Community Runs
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Join weekly group runs with runners of all levels.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Events
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Races, social events, and everything in between.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
            <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Connect
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Meet fellow runners and build lasting friendships.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
