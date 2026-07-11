import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { recommendMovies } from "@/lib/ai.functions";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
  head: () => ({ meta: [{ title: "M.O.V.I.E-BOT 3000 — Netflix 2006" }] }),
});

type Msg = { role: "user" | "bot"; text: string };

function AssistantPage() {
  const call = useServerFn(recommendMovies);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Greetings! I am M.O.V.I.E-BOT 3000, your Netflix.com movie assistant. Tell me what you're in the mood for and I'll suggest DVDs from our catalog!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const { reply } = await call({ data: { message: q } });
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `⚠ Connection error! ${err instanceof Error ? err.message : "Please try again."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DesktopShell>
      <XPWindow title="M.O.V.I.E-BOT 3000™ — AI Movie Assistant" icon="🤖">
        <NavBar />
        <div className="p-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="netflix-bar px-3 py-2 flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <div className="font-bold text-sm">M.O.V.I.E-BOT 3000</div>
                <div className="text-[10px] opacity-90">
                  Powered by Neural Recommendation Engine v2.06 · Beta
                </div>
              </div>
              <span className="ml-auto flex items-center gap-1 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-green-400 xp-blink" /> Online
              </span>
            </div>

            <div
              ref={scrollRef}
              className="xp-panel h-96 overflow-y-auto p-3 space-y-3 bg-white"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "bot" && <div className="text-2xl">🤖</div>}
                  <div
                    className="max-w-[75%] px-3 py-2 text-[12px] border"
                    style={{
                      background: m.role === "user" ? "#dbe9ff" : "#fffbe6",
                      borderColor: m.role === "user" ? "#4a8ce0" : "#d4b556",
                      borderRadius: m.role === "user" ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.text}
                  </div>
                  {m.role === "user" && <div className="text-2xl">👤</div>}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 items-center">
                  <div className="text-2xl">🤖</div>
                  <div className="px-3 py-2 text-[11px] bg-yellow-50 border border-yellow-500 rounded xp-blink">
                    Thinking... (dialing neural net at 56.6 Kbps)
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={send} className="xp-panel p-2 flex gap-2 mt-1">
              <input
                className="xp-input flex-1"
                placeholder="Try: 'I want something funny with lots of action'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="xp-btn-primary" disabled={loading}>
                {loading ? "..." : "Send ▶"}
              </button>
            </form>

            <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
              {[
                "I want a funny movie",
                "Something scary for date night",
                "Best action films",
                "Family-friendly picks",
              ].map((s) => (
                <button
                  key={s}
                  className="xp-btn"
                  style={{ minWidth: 0, fontSize: 10, padding: "2px 8px" }}
                  onClick={() => setInput(s)}
                  disabled={loading}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </XPWindow>
    </DesktopShell>
  );
}
