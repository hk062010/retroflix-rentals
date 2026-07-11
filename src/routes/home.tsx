import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { addToQueue, getQueue } from "@/lib/queue";
import { getHomeSections, type TmdbMovie } from "@/lib/tmdb.functions";
import { useEffect, useState } from "react";

const homeQuery = queryOptions({
  queryKey: ["tmdb", "home"],
  queryFn: () => getHomeSections(),
  staleTime: 5 * 60_000,
});

export const Route = createFileRoute("/home")({
  component: HomePage,
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: () => ({ meta: [{ title: "Home — Netflix 2006" }] }),
  errorComponent: ({ error }) => (
    <DesktopShell>
      <XPWindow title="Netflix.com — Error" icon="⚠">
        <NavBar />
        <div className="p-6 bg-white text-[12px]">
          <div className="xp-groupbox">
            <div className="font-bold mb-1">Could not load movies from TMDb</div>
            <div className="text-gray-700">{error.message}</div>
          </div>
        </div>
      </XPWindow>
    </DesktopShell>
  ),
  pendingComponent: () => (
    <DesktopShell>
      <XPWindow title="Netflix.com — Home" icon="🌐">
        <NavBar />
        <div className="p-6 bg-white text-[12px] xp-blink">⏳ Dialing TMDb… please wait</div>
      </XPWindow>
    </DesktopShell>
  ),
});

function HomePage() {
  const { data } = useSuspenseQuery(homeQuery);
  const { featured, newReleases, topRentals, recommended } = data;

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

function FeaturedBanner({ movie }: { movie: TmdbMovie }) {
  return (
    <section
      className="border-2 border-black/40 relative overflow-hidden"
      style={{
        backgroundImage: movie.backdrop
          ? `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.2) 100%), url(${movie.backdrop})`
          : "linear-gradient(135deg,#1a1a1a,#5a0000)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="p-6 text-white grid md:grid-cols-[140px_1fr] gap-6 items-center min-h-[260px]">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-[140px] h-[210px] object-cover border-2 border-black/60 shadow-lg"
          />
        ) : (
          <div className="w-[140px] h-[210px] bg-black/50 flex items-center justify-center text-5xl">🎬</div>
        )}
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-80 xp-blink">
            ★ Featured DVD Release ★
          </div>
          <h1 className="text-3xl font-bold" style={{ textShadow: "2px 2px 0 #000" }}>
            {movie.title}
          </h1>
          <div className="text-[11px] opacity-90 mt-1">
            {movie.year || "—"} · {movie.genre} · ★ {movie.rating.toFixed(1)}/10
          </div>
          <p className="text-sm mt-3 max-w-xl line-clamp-4" style={{ textShadow: "1px 1px 2px #000" }}>
            {movie.overview}
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

function Row({ title, movies }: { title: string; movies: TmdbMovie[] }) {
  return (
    <section>
      <div className="netflix-bar px-3 py-1 text-[12px] font-bold flex items-center justify-between">
        <span>{title}</span>
        <Link to="/browse" className="text-[10px] underline">See all »</Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 p-3 xp-panel">
        {movies.map((m) => (
          <TmdbCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}

function TmdbCard({ movie }: { movie: TmdbMovie }) {
  const [inQueue, setInQueue] = useState(false);
  useEffect(() => {
    const check = () => setInQueue(!!getQueue().find((i) => i.id === movie.id));
    check();
    window.addEventListener("queue-updated", check);
    return () => window.removeEventListener("queue-updated", check);
  }, [movie.id]);

  return (
    <div className="movie-card flex flex-col gap-1">
      <Link
        to="/watch/$id"
        params={{ id: movie.id }}
        className="block aspect-[2/3] relative overflow-hidden border border-black/40 bg-black"
      >
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl">🎬</div>
        )}
        <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded-sm">
          ★ {movie.rating.toFixed(1)}
        </div>
      </Link>
      <div className="text-[11px] font-bold truncate" title={movie.title}>{movie.title}</div>
      <div className="text-[10px] text-gray-600 truncate">
        {movie.year || "—"} · {movie.genre}
      </div>
      <button
        className={inQueue ? "xp-btn" : "xp-btn-primary"}
        onClick={() => addToQueue(movie.id)}
        disabled={inQueue}
        style={{ fontSize: 10, minWidth: 0, padding: "2px 6px" }}
      >
        {inQueue ? "✓ In Queue" : "+ Add to Queue"}
      </button>
    </div>
  );
}
