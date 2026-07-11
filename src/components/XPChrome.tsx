import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { getQueue } from "@/lib/queue";


export function XPWindow({
  title,
  icon = "🎬",
  children,
}: {
  title: string;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <div className="xp-window w-full max-w-[1024px] mx-auto">
      <div className="xp-titlebar">
        <span>{icon}</span>
        <span className="flex-1 truncate">{title}</span>
        <button className="xp-titlebar-btn" aria-label="Minimize">_</button>
        <button className="xp-titlebar-btn" aria-label="Maximize">▢</button>
        <button
          className="xp-titlebar-btn"
          aria-label="Close"
          style={{ background: "linear-gradient(180deg,#e56464 0%,#a41818 100%)" }}
        >
          ✕
        </button>
      </div>
      <div className="crt-screen">
        {children}
        <div className="crt-scanlines absolute inset-0" />
        <div className="crt-vignette" />
      </div>
    </div>
  );
}

export function NavBar() {
  const { location } = useRouterState();
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(getQueue().length);
    update();
    window.addEventListener("queue-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("queue-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const links: Array<{ to: string; label: string }> = [
    { to: "/home", label: "Home" },
    { to: "/browse", label: "Browse" },
    { to: "/queue", label: `My Queue (${count})` },
    { to: "/assistant", label: "AI Assistant" },
    { to: "/account", label: "Account" },
  ];

  return (
    <div className="netflix-bar flex items-center px-4 py-2 gap-1">
      <Link to="/home" className="netflix-logo text-2xl mr-4 tracking-tighter">
        NETFLIX
      </Link>
      <span className="text-white/80 text-[10px] italic mr-4 hidden sm:inline">
        Movies Delivered. Entertainment Connected.
      </span>
      <div className="flex-1 flex flex-wrap gap-1">
        {links.map((l) => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1 text-[11px] font-bold border border-transparent"
              style={{
                background: active
                  ? "linear-gradient(180deg,#fff,#f0d0d0)"
                  : "linear-gradient(180deg,rgba(255,255,255,0.15),rgba(0,0,0,0.15))",
                color: active ? "#8b0000" : "white",
                borderColor: active ? "#4a0000" : "rgba(0,0,0,0.3)",
                textShadow: active ? "none" : "1px 1px 0 rgba(0,0,0,0.4)",
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function StatusBar({ status = "Ready" }: { status?: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      );
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="xp-taskbar flex items-center gap-2 px-2 py-1 mt-auto">
      <div className="xp-start-btn text-[11px]">🪟 start</div>
      <div className="flex-1 flex gap-1 pl-2">
        <span className="px-3 py-0.5 bg-blue-900/40 border border-white/20 rounded-sm text-[11px]">
          🎬 Netflix
        </span>
      </div>
      <span className="text-[11px]">{status}</span>
      <span className="border-l border-white/40 pl-2 text-[11px]">📶 Connected</span>
      <span className="text-[11px]">🔊</span>
      <span className="text-[11px]">{time}</span>
    </div>
  );
}

export function DesktopShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="xp-desktop min-h-screen flex flex-col">
      {loading && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none">
          <div className="xp-window mt-24 w-[360px] pointer-events-auto">
            <div className="xp-titlebar">
              <span className="xp-hourglass">⌛</span>
              <span className="flex-1">Loading Netflix.com…</span>
            </div>
            <div className="p-3 bg-[color:var(--xp-window)] space-y-2">
              <div className="text-[11px]">Please wait while the page loads…</div>
              <div className="xp-progress-animated">
                <div className="xp-progress-fill" />
              </div>
              <div className="text-[10px] text-gray-600">
                Connected at 56.6 Kbps · Transferring data from netflix.com
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 p-4 pb-2">{children}</div>
      <StatusBar />
    </div>
  );
}
