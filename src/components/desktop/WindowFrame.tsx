import { useEffect, useRef, useState, type ReactNode } from "react";
import { wm, type WindowState } from "@/lib/window-manager";
import { sfx } from "@/lib/sounds";

export function WindowFrame({ w, children }: { w: WindowState; children: ReactNode }) {
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [anim, setAnim] = useState<"minimize" | "restore" | null>(null);
  const [hidden, setHidden] = useState(w.minimized);
  const prevMin = useRef(w.minimized);

  useEffect(() => {
    if (prevMin.current === w.minimized) return;
    prevMin.current = w.minimized;
    if (w.minimized) {
      setAnim("minimize");
      setHidden(false);
      const t = setTimeout(() => { setAnim(null); setHidden(true); }, 220);
      return () => clearTimeout(t);
    } else {
      setHidden(false);
      setAnim("restore");
      const t = setTimeout(() => setAnim(null), 220);
      return () => clearTimeout(t);
    }
  }, [w.minimized]);

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: MouseEvent) => wm.move(w.id, e.clientX - drag.dx, Math.max(0, e.clientY - drag.dy));
    const onUp = () => setDrag(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, w.id]);

  if (hidden && !anim) return null;
  const focused = wm.get().focus === w.id;

  return (
    <div
      ref={ref}
      className="xp-window absolute flex flex-col"
      data-anim={anim ?? undefined}
      style={{
        left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z,
        boxShadow: focused
          ? "0 8px 40px rgba(0,0,0,0.5), 2px 2px 0 rgba(0,0,0,0.2)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        opacity: focused ? 1 : 0.96,
      }}
      onMouseDown={() => { if (!anim) wm.focus(w.id); }}
    >
      <div
        className="xp-titlebar select-none cursor-move"
        style={{ background: focused ? undefined : "linear-gradient(180deg,#7a96df 0%,#93a9d9 50%,#6d84c4 100%)" }}
        onMouseDown={(e) => {
          if (w.maximized) return;
          const rect = ref.current!.getBoundingClientRect();
          setDrag({ dx: e.clientX - rect.left, dy: e.clientY - rect.top });
        }}
        onDoubleClick={() => wm.toggleMax(w.id)}
      >
        <span>{w.icon}</span>
        <span className="flex-1 truncate">{w.title}</span>
        <button className="xp-titlebar-btn" onClick={(e) => { e.stopPropagation(); sfx.click(); wm.minimize(w.id); }}>_</button>
        <button className="xp-titlebar-btn" onClick={(e) => { e.stopPropagation(); sfx.click(); wm.toggleMax(w.id); }}>▢</button>
        <button
          className="xp-titlebar-btn"
          style={{ background: "linear-gradient(180deg,#e56464 0%,#a41818 100%)" }}
          onClick={(e) => { e.stopPropagation(); sfx.click(); wm.close(w.id); }}
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-hidden bg-[color:var(--xp-window)]" style={{ minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}
