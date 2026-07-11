import { createFileRoute, Link } from "@tanstack/react-router";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { MovieCard } from "@/components/MovieCard";
import { addToQueue } from "@/lib/queue";
import { MOVIES, type Movie } from "@/lib/movies";

export const Route = createFileRoute("/home")({
  component: HomePage,
  head: () => ({ meta: [{ title: "Home — Netflix 2006" }] }),
});

function HomePage() {
  const featured = MOVIES.find((m) => m.featured) ?? MOVIES[0];
  const newReleases = MOVIES.filter((m) => m.year >= 2006).slice(0, 6);
  const topRentals = MOVIES.slice(0, 6);
  const recommended = MOVIES.slice(6, 12);

  return (
    <DesktopShell>
      <XPWindow title="Netflix.com — Home — Microsoft Internet Explorer" icon="🌐">
        <NavBar />
        <div className="p-4 space-y-6 bg-white">
          <FeaturedBanner movie={featured} />
          <Row title="🆕 New Releases" movies={newReleases} />
          <Row title="🔥 Top Rentals This Week" movies={topRentals} />
          <Row title="💡 Recommended For You" movies={recommended} />
        </div>
      </XPWindow>
    </DesktopShell>
  );
}

function FeaturedBanner({ movie }: { movie: Movie }) {
  return (
    <section
      className="border-2 border-black/40 relative overflow-hidden"
      style={{ background: movie.color }}
    >
      <div className="p-6 text-white grid md:grid-cols-[140px_1fr] gap-6 items-center min-h-[260px]">
        <div className="w-[140px] h-[210px] bg-black/40 border-2 border-black/60 shadow-lg flex items-center justify-center text-6xl">
          {movie.emoji}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-80 xp-blink">
            ★ Featured DVD Release ★
          </div>
          <h1 className="text-3xl font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
            {movie.title}
          </h1>
          <div className="text-[11px] opacity-90 mt-1">
            {movie.year} · {movie.genre} · {movie.rating} · {movie.runtime}
          </div>
          <p className="text-sm mt-3 max-w-xl" style={{ textShadow: "1px 1px 2px #000" }}>
            {movie.synopsis}
          </p>
          <div className="mt-4 flex gap-2">
            <button className="xp-btn-primary" onClick={() => addToQueue(movie.id)}>
              + Add DVD to Queue
            </button>
            <Link to="/watch/$id" params={{ id: movie.id }} className="xp-btn">
              ▶ Watch Preview
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ title, movies }: { title: string; movies: Movie[] }) {
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
