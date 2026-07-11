import { createFileRoute, Link } from "@tanstack/react-router";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { MovieCard } from "@/components/MovieCard";
import { MOVIES } from "@/lib/movies";
import { addToQueue } from "@/lib/queue";

export const Route = createFileRoute("/home")({
  component: HomePage,
  head: () => ({
    meta: [{ title: "Home — Netflix 2006" }],
  }),
});

function HomePage() {
  const featured = MOVIES.find((m) => m.featured)!;
  const newReleases = MOVIES.slice(1, 7);
  const topRentals = [...MOVIES].sort((a, b) => a.title.localeCompare(b.title)).slice(0, 6);

  return (
    <DesktopShell>
      <XPWindow title="Netflix.com — Home — Microsoft Internet Explorer" icon="🌐">
        <NavBar />
        <div className="p-4 space-y-6 bg-white">
          {/* Featured banner */}
          <section
            className="border-2 border-black/40 relative overflow-hidden"
            style={{ background: featured.color }}
          >
            <div className="p-6 text-white grid md:grid-cols-[auto_1fr] gap-6 items-center">
              <div className="text-8xl">{featured.emoji}</div>
              <div>
                <div className="text-[10px] uppercase tracking-widest opacity-80 xp-blink">
                  ★ Featured DVD Release ★
                </div>
                <h1 className="text-3xl font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
                  {featured.title}
                </h1>
                <div className="text-[11px] opacity-90 mt-1">
                  {featured.year} · {featured.genre} · {featured.rating} · {featured.runtime}
                </div>
                <p className="text-sm mt-3 max-w-xl" style={{ textShadow: "1px 1px 2px #000" }}>
                  {featured.synopsis}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="xp-btn-primary"
                    onClick={() => addToQueue(featured.id)}
                  >
                    + Add DVD to Queue
                  </button>
                  <Link to="/watch/$id" params={{ id: featured.id }} className="xp-btn">
                    ▶ Watch Preview
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Row title="🆕 New Releases" movies={newReleases} />
          <Row title="🔥 Top Rentals This Week" movies={topRentals} />
          <Row title="💡 Recommended For You" movies={MOVIES.slice(6, 12)} />
        </div>
      </XPWindow>
    </DesktopShell>
  );
}

function Row({ title, movies }: { title: string; movies: typeof MOVIES }) {
  return (
    <section>
      <div className="netflix-bar px-3 py-1 text-[12px] font-bold flex items-center justify-between">
        <span>{title}</span>
        <Link to="/browse" className="text-[10px] underline">See all »</Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-3 xp-panel">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
