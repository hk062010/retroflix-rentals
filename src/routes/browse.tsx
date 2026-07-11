import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { MovieCard } from "@/components/MovieCard";
import { MOVIES, GENRES } from "@/lib/movies";

export const Route = createFileRoute("/browse")({
  component: BrowsePage,
  head: () => ({ meta: [{ title: "Browse — Netflix 2006" }] }),
});

function BrowsePage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");

  const results = useMemo(() => {
    return MOVIES.filter((m) => {
      const matchesGenre = genre === "All" || m.genre === genre;
      const matchesQ = m.title.toLowerCase().includes(q.toLowerCase());
      return matchesGenre && matchesQ;
    });
  }, [q, genre]);

  return (
    <DesktopShell>
      <XPWindow title="Browse DVDs — Netflix.com" icon="📀">
        <NavBar />
        <div className="p-4 bg-white space-y-4">
          <div className="xp-groupbox flex flex-wrap items-end gap-3">
            <label className="flex flex-col text-[11px]">
              <span className="mb-1">Search Title:</span>
              <input
                className="xp-input w-56"
                placeholder="e.g. Casino Royale"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <label className="flex flex-col text-[11px]">
              <span className="mb-1">Genre:</span>
              <select
                className="xp-input"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </label>
            <button
              className="xp-btn"
              onClick={() => {
                setQ("");
                setGenre("All");
              }}
            >
              Reset
            </button>
            <div className="ml-auto text-[11px] text-gray-700">
              {results.length} title{results.length === 1 ? "" : "s"} found
            </div>
          </div>

          {results.length === 0 ? (
            <div className="xp-groupbox text-center text-[12px] text-gray-700 py-12">
              No DVDs match your search. Try a different title or genre.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {results.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          )}
        </div>
      </XPWindow>
    </DesktopShell>
  );
}
