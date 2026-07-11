import { MOVIES } from "@/lib/movies";

export function ModernMode({ onClose }: { onClose: () => void }) {
  const featured = MOVIES[0];
  return (
    <div
      className="fixed inset-0 z-[10001] overflow-y-auto"
      style={{
        background: "#0a0a0a",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        animation: "fadeIn 0.6s ease-out",
      }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-black to-transparent">
        <div className="text-red-600 text-3xl font-black tracking-tight">NETFLIX</div>
        <div className="flex items-center gap-6 text-sm">
          <span>Home</span><span>TV Shows</span><span>Movies</span><span>My List</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs backdrop-blur"
          >
            ← Back to 2006 (Esc)
          </button>
        </div>
      </div>

      <div className="relative h-[70vh] flex items-end p-12" style={{ background: featured.color }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs tracking-widest text-red-500 mb-2">N SERIES · TOP 10 TODAY</div>
          <h1 className="text-6xl font-bold mb-4">{featured.title}</h1>
          <p className="text-lg text-white/80 mb-6 max-w-xl">{featured.synopsis}</p>
          <div className="flex gap-3">
            <button className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-white/90 flex items-center gap-2">
              ▶ Play
            </button>
            <button className="bg-white/20 backdrop-blur px-8 py-3 rounded font-bold hover:bg-white/30">
              ⓘ More Info
            </button>
          </div>
        </div>
      </div>

      <div className="p-12 space-y-10">
        {[["Trending Now", MOVIES.slice(0, 6)], ["Only on Netflix", MOVIES.slice(6)]].map(([title, list]) => (
          <section key={title as string}>
            <h2 className="text-xl font-bold mb-4">{title as string}</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {(list as typeof MOVIES).map((m) => (
                <div
                  key={m.id}
                  className="aspect-[2/3] rounded overflow-hidden relative hover:scale-105 transition-transform cursor-pointer"
                  style={{ background: m.color }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                    <div className="text-4xl mb-1">{m.emoji}</div>
                    <div className="text-xs font-bold">{m.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center py-16 border-t border-white/10">
          <div className="text-2xl font-bold mb-2">Netflix, 2026.</div>
          <p className="text-white/60 max-w-lg mx-auto text-sm">
            You just watched twenty years of UI evolution in one keystroke.
            Every feature you saw in 2006-mode — AI recommendations, streaming, notifications, DVD logistics —
            was redesigned around the constraints of that era.
          </p>
          <button onClick={onClose} className="mt-6 px-6 py-2 border border-white/30 rounded hover:bg-white/10 text-sm">
            Return to 2006
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
