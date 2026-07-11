import { useEffect, useState } from "react";
import { getSpeed, setSpeed, type Speed } from "@/lib/dialup";
import { getQueue } from "@/lib/queue";
import { sfx } from "@/lib/sounds";
import { wm, useWindows } from "@/lib/window-manager";

export function Taskbar({ onStart }: { onStart: () => void }) {
  const { windows, focus } = useWindows();
  const [time, setTime] = useState("");
  const [speed, setLocalSpeed] = useState<Speed>("512k");
  const [qCount, setQCount] = useState(0);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 30000);
    setLocalSpeed(getSpeed());
    setQCount(getQueue().length);
    const s = () => setLocalSpeed(getSpeed());
    const q = () => setQCount(getQueue().length);
    window.addEventListener("dialup-updated", s);
    window.addEventListener("queue-updated", q);
    return () => {
      clearInterval(t);
      window.removeEventListener("dialup-updated", s);
      window.removeEventListener("queue-updated", q);
    };
  }, []);

  return (
    <div className="xp-taskbar fixed bottom-0 inset-x-0 flex items-center gap-1 px-1 z-[9999]" style={{ height: 36 }}>
      <button
        className="xp-start-btn flex items-center gap-2"
        onClick={() => { sfx.click(); onStart(); }}
        style={{ height: 30 }}
      >
        <span className="text-base">🪟</span>
        <span>start</span>
      </button>
      <div className="flex-1 flex gap-1 pl-2 overflow-hidden">
        {windows.map((w) => {
          const active = focus === w.id && !w.minimized;
          return (
            <button
              key={w.id}
              onClick={() => {
                sfx.click();
                if (w.minimized) wm.focus(w.id);
                else if (active) wm.minimize(w.id);
                else wm.focus(w.id);
              }}
              className="text-[11px] flex items-center gap-1 px-2 py-1 min-w-[130px] max-w-[180px] truncate border transition-colors"
              style={{
                background: active
                  ? "linear-gradient(180deg,#1560c9 0%,#3a89e9 100%)"
                  : w.minimized
                    ? "linear-gradient(180deg,#6ea3e8 0%,#3f74c9 100%)"
                    : "linear-gradient(180deg,#4a90e2 0%,#245edb 100%)",
                borderColor: "#0146c4",
                color: "white",
                opacity: w.minimized ? 0.75 : 1,
                fontStyle: w.minimized ? "italic" : "normal",
                textShadow: "1px 1px 0 rgba(0,0,0,0.4)",
                boxShadow: active
                  ? "inset 0 2px 3px rgba(0,0,0,0.4)"
                  : "inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <span>{w.icon}</span>
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 px-2 border-l border-blue-400/60 bg-blue-900/30 h-full">
        <button
          className="text-[11px] flex items-center gap-1"
          title={speed === "56k" ? "Dial-Up 56 Kbps — click to speed up" : "Broadband 512 Kbps — click to slow down"}
          onClick={() => {
            const next: Speed = speed === "56k" ? "512k" : "56k";
            setSpeed(next);
            if (next === "56k") sfx.modem();
          }}
        >
          <span>📶</span>
          <span className={speed === "56k" ? "text-yellow-200" : "text-green-300"}>{speed === "56k" ? "56k" : "512k"}</span>
        </button>
        <span className="text-[11px]" title="Queue">📬 {qCount}</span>
        <span className="text-[11px]">🔊</span>
        <span className="text-[11px] font-medium tabular-nums">{time}</span>
      </div>
    </div>
  );
}
