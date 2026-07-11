import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { findMovie } from "@/lib/movies";
import { addToQueue } from "@/lib/queue";
import { getTmdbMovie } from "@/lib/tmdb.functions";

type WatchMovie = {
  id: string;
  title: string;
  year: number | string;
  genre: string;
  rating: string;
  runtime: string;
  synopsis: string;
  color?: string;
  emoji?: string;
  poster?: string | null;
  backdrop?: string | null;
};

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
  loader: async ({ params }): Promise<{ movie: WatchMovie }> => {
    const local = findMovie(params.id);
    if (local) {
      return {
        movie: {
          id: local.id,
          title: local.title,
          year: local.year,
          genre: local.genre,
          rating: local.rating,
          runtime: local.runtime,
          synopsis: local.synopsis,
          color: local.color,
          emoji: local.emoji,
          poster: null,
          backdrop: null,
        },
      };
    }
    try {
      const m = await getTmdbMovie({ data: { id: params.id } });
      return {
        movie: {
          id: m.id,
          title: m.title,
          year: m.year || "—",
          genre: m.genre,
          rating: m.certification || `★ ${m.rating.toFixed(1)}`,
          runtime: m.runtime ?? "—",
          synopsis: m.overview,
          color: "linear-gradient(135deg,#111,#333)",
          emoji: "🎬",
          poster: m.poster,
          backdrop: m.backdrop,
        },
      };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.movie.title ?? "Watch"} — Netflix 2006` }],
  }),
});

function WatchPage() {
  const { movie } = Route.useLoaderData();
  const [quality, setQuality] = useState<"240p" | "360p">("240p");
  const [buffering, setBuffering] = useState(true);
  const [playhead, setPlayhead] = useState(0);
  const total = 30;

  useEffect(() => {
    setBuffering(true);
    setPlayhead(0);
    const t = setTimeout(() => setBuffering(false), quality === "240p" ? 1500 : 3000);
    return () => clearTimeout(t);
  }, [quality, movie.id]);

  useEffect(() => {
    if (buffering) return;
    const i = setInterval(() => {
      setPlayhead((p) => (p >= total ? total : p + 0.25));
    }, 250);
    return () => clearInterval(i);
  }, [buffering]);

  const pct = (playhead / total) * 100;

  return (
    <DesktopShell>
      <XPWindow title={`Netflix Preview Player — ${movie.title}`} icon="▶">
        <NavBar />
        <div className="p-4 bg-white space-y-3">
          <div className="grid md:grid-cols-[1fr_260px] gap-4">
            <div>
              <div
                className="relative aspect-video border-4 border-gray-800 overflow-hidden"
                style={{
                  background: movie.backdrop
                    ? `url(${movie.backdrop}) center/cover no-repeat`
                    : movie.color,
                  boxShadow: "inset 0 0 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,150,255,0.2)",
                  imageRendering: quality === "240p" ? "pixelated" : "auto",
                }}
              >
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-white text-center"
                  style={{
                    filter: quality === "240p" ? "blur(1.5px)" : "blur(0.5px)",
                    background: movie.backdrop ? "rgba(0,0,0,0.35)" : "transparent",
                  }}
                >
                  {!movie.backdrop && <div className="text-8xl mb-2 drop-shadow-2xl">{movie.emoji}</div>}
                  <div
                    className="text-3xl font-bold"
                    style={{ textShadow: "3px 3px 0 #000" }}
                  >
                    {movie.title}
                  </div>
                  <div className="text-[10px] mt-2 opacity-80">Official Preview · 30 seconds</div>
                </div>

                {/* scanlines */}
                <div className="crt-scanlines absolute inset-0" />

                {buffering && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
                    <div className="text-sm mb-2 xp-blink">⏳ Buffering...</div>
                    <div className="w-56 h-3 border border-white/60 overflow-hidden">
                      <div className="buffer-bar h-full w-full" />
                    </div>
                    <div className="text-[10px] mt-2 opacity-80">
                      Estimated at 56.6 Kbps · Please wait...
                    </div>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5">
                  ● REC {quality}
                </div>
              </div>

              {/* controls */}
              <div className="xp-panel mt-1 p-2 flex items-center gap-2">
                <button className="xp-btn" style={{ minWidth: 0, padding: "2px 8px" }}>
                  ⏮
                </button>
                <button className="xp-btn-primary" style={{ minWidth: 0, padding: "2px 10px" }}>
                  {buffering ? "⏸" : "▶"}
                </button>
                <button className="xp-btn" style={{ minWidth: 0, padding: "2px 8px" }}>
                  ⏭
                </button>
                <div className="text-[10px] w-10 text-right">
                  0:{Math.floor(playhead).toString().padStart(2, "0")}
                </div>
                <div className="flex-1 h-3 bg-white border border-gray-500 relative">
                  <div
                    className="h-full"
                    style={{ width: `${pct}%`, background: "linear-gradient(180deg,#4a8ce0,#1e5cc7)" }}
                  />
                </div>
                <div className="text-[10px] w-10">0:{total}</div>
                <div className="text-[10px]">🔊</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="xp-groupbox">
                <div className="font-bold text-[12px] mb-1">{movie.title}</div>
                <div className="text-[10px] text-gray-600 mb-2">
                  {movie.year} · {movie.genre} · {movie.rating} · {movie.runtime}
                </div>
                <p className="text-[11px]">{movie.synopsis}</p>
              </div>

              <div className="xp-groupbox space-y-2">
                <div className="text-[11px] font-bold">📡 Streaming Quality</div>
                {(["240p", "360p"] as const).map((q) => (
                  <label key={q} className="flex items-center gap-2 text-[11px]">
                    <input
                      type="radio"
                      checked={quality === q}
                      onChange={() => setQuality(q)}
                    />
                    <span>
                      {q} {q === "240p" ? "(Recommended for dial-up)" : "(Broadband — slower load)"}
                    </span>
                  </label>
                ))}
                <div className="text-[10px] text-gray-600 pt-1 border-t border-gray-300">
                  ⚠ Higher quality may take longer to buffer.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="xp-btn-primary"
                  onClick={() => addToQueue(movie.id)}
                >
                  + Add DVD to My Queue
                </button>
                <Link to="/browse" className="xp-btn text-center">
                  ← Back to Browse
                </Link>
              </div>
            </div>
          </div>
        </div>
      </XPWindow>
    </DesktopShell>
  );
}
