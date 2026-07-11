import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { getQueue, moveItem, removeFromQueue, type QueueItem } from "@/lib/queue";
import { findMovie } from "@/lib/movies";

export const Route = createFileRoute("/queue")({
  component: QueuePage,
  head: () => ({ meta: [{ title: "My DVD Queue — Netflix 2006" }] }),
});

const STATUS_COLORS: Record<string, string> = {
  Preparing: "#e6a800",
  Shipped: "#1e64d7",
  Delivered: "#2a8a2a",
};
const STATUS_ICON: Record<string, string> = {
  Preparing: "📦",
  Shipped: "🚚",
  Delivered: "✅",
};

function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  useEffect(() => {
    setQueue(getQueue());
    const h = () => setQueue(getQueue());
    window.addEventListener("queue-updated", h);
    return () => window.removeEventListener("queue-updated", h);
  }, []);

  return (
    <DesktopShell>
      <XPWindow title="My DVD Queue — Netflix.com" icon="📬">
        <NavBar />
        <div className="p-4 bg-white space-y-4">
          <div className="netflix-bar px-3 py-2 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">📬 Your DVD Rental Queue</div>
              <div className="text-[10px] opacity-90">
                Your next DVD ships as soon as we receive the previous one.
              </div>
            </div>
            <div className="text-[11px] font-bold bg-white/20 px-2 py-1 border border-white/40">
              {queue.length} DVD{queue.length === 1 ? "" : "s"}
            </div>
          </div>

          {queue.length === 0 ? (
            <div className="xp-groupbox text-center py-12 space-y-3">
              <div className="text-4xl">📭</div>
              <div className="text-[12px]">Your queue is empty!</div>
              <Link to="/browse" className="xp-btn-primary inline-block">
                Browse DVDs
              </Link>
            </div>
          ) : (
            <table className="w-full xp-panel text-[12px]">
              <thead className="netflix-bar text-[11px]">
                <tr>
                  <th className="p-2 text-left w-12">#</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Genre</th>
                  <th className="p-2 text-left">Shipping</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item, idx) => {
                  const m = findMovie(item.id);
                  if (!m) return null;
                  return (
                    <tr key={item.id} className="border-b border-gray-300 hover:bg-yellow-50">
                      <td className="p-2 font-bold">{idx + 1}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-11 flex items-center justify-center text-xl border border-black/30"
                            style={{ background: m.color }}
                          >
                            {m.emoji}
                          </div>
                          <div>
                            <div className="font-bold">{m.title}</div>
                            <div className="text-[10px] text-gray-600">{m.year} · {m.runtime}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">{m.genre}</td>
                      <td className="p-2">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-white rounded-sm"
                          style={{ background: STATUS_COLORS[item.status] }}
                        >
                          {STATUS_ICON[item.status]} {item.status}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            className="xp-btn"
                            style={{ minWidth: 0, padding: "2px 6px" }}
                            onClick={() => moveItem(item.id, -1)}
                            disabled={idx === 0}
                          >
                            ▲
                          </button>
                          <button
                            className="xp-btn"
                            style={{ minWidth: 0, padding: "2px 6px" }}
                            onClick={() => moveItem(item.id, 1)}
                            disabled={idx === queue.length - 1}
                          >
                            ▼
                          </button>
                          <button
                            className="xp-btn"
                            style={{ minWidth: 0, padding: "2px 8px", color: "#a00" }}
                            onClick={() => removeFromQueue(item.id)}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="xp-groupbox text-[11px] text-gray-700">
            💡 <b>Tip:</b> Rearrange your queue to prioritize what ships next. Once we receive your
            current DVD, the next one on your list ships automatically. No late fees, ever!
          </div>
        </div>
      </XPWindow>
    </DesktopShell>
  );
}
