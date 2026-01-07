export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
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
