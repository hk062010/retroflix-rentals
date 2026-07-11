import type { Movie } from "@/lib/movies";
import { Link } from "@tanstack/react-router";
import { addToQueue, getQueue } from "@/lib/queue";
import { useEffect, useState } from "react";

export function MovieCard({ movie }: { movie: Movie }) {
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
        className="block aspect-[2/3] relative overflow-hidden border border-black/40"
        style={{ background: movie.color }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 text-center">
          <span className="text-5xl mb-2 drop-shadow-lg">{movie.emoji}</span>
          <span className="font-bold text-sm leading-tight drop-shadow" style={{ textShadow: "1px 1px 2px #000" }}>
            {movie.title}
          </span>
          <span className="text-[10px] mt-1 opacity-80">{movie.year}</span>
        </div>
        <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded-sm">
          {movie.rating}
        </div>
      </Link>
      <div className="text-[11px] font-bold truncate">{movie.title}</div>
      <div className="text-[10px] text-gray-600">{movie.genre} · {movie.runtime}</div>
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
