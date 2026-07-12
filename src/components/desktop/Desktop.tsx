import { useEffect, useState } from "react";
import { sfx } from "@/lib/sounds";
import { wm, useWindows } from "@/lib/window-manager";
import { WindowFrame } from "./WindowFrame";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { ModernMode } from "./ModernMode";
import { XPError } from "./XPError";
import { initDialup } from "@/lib/dialup";
import netflixIcon from "@/assets/netflix.ico.asset.json";

type IconDef = { id: string; icon: string; img?: string; label: string; open: () => void };

const ICONS: IconDef[] = [
  { id: "netflix", icon: "🎬", img: netflixIcon.url, label: "Netflix", open: () => wm.open({ id: "netflix", appId: "netflix", title: "Netflix.com — Microsoft Internet Explorer", icon: "🌐", url: "/home?embed=1", w: 960, h: 660 }) },
  { id: "cinebot", icon: "👥", label: "CineBot 1.0", open: () => wm.open({ id: "cinebot", appId: "cinebot", title: "CineBot 1.0 — MSN Movie Messenger", icon: "💬", url: "/assistant?embed=1", w: 560, h: 640 }) },
  { id: "mycomp", icon: "💻", label: "My Computer", open: () => wm.open({ id: "mycomp", appId: "mycomputer", title: "My Computer", icon: "🖥", content: "mycomputer", w: 560, h: 400 }) },
  { id: "docs", icon: "🗂️", label: "My Documents", open: () => wm.open({ id: "docs", appId: "mycomputer", title: "My Documents", icon: "📁", content: "notepad", w: 520, h: 420 }) },
  { id: "browse", icon: "💿", label: "DVD Library", open: () => wm.open({ id: "browse", appId: "netflix", title: "Browse DVDs — Netflix.com", icon: "📀", url: "/browse?embed=1", w: 960, h: 640 }) },
  { id: "ie", icon: "🌍", label: "Internet Explorer", open: () => wm.open({ id: "ie", appId: "ie", title: "MSN.com — Microsoft Internet Explorer", icon: "🌐", url: "/home?embed=1", w: 900, h: 620 }) },
  { id: "recycle", icon: "♻️", label: "Recycle Bin", open: () => wm.open({ id: "recycle", appId: "recycle", title: "Recycle Bin", icon: "🗑", content: "recycle", w: 500, h: 360 }) },
];

export function Desktop() {
  const { windows } = useWindows();
  const [startOpen, setStartOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [modern, setModern] = useState(false);

  useEffect(() => {
    initDialup();
    // Random XP error easter egg
    const t = setInterval(() => {
      if (Math.random() < 0.02) {
        setError(true);
        sfx.error();
      }
    }, 45000);
    return () => clearInterval(t);
  }, []);

  // Konami code
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[i]) {
        i++;
        if (i === seq.length) {
          setModern(true);
          sfx.startup();
          i = 0;
        }
      } else {
        i = k === seq[0] ? 1 : 0;
      }
      if (e.key === "Escape") setModern(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="xp-desktop min-h-screen w-full relative overflow-hidden isolate" onClick={() => setSelected(null)}>
      {/* Background FX layer — z-0, non-interactive. All post-processing
          (vignette, bloom, CRT scanlines, phosphor) is contained here so it
          can never darken or tint the icon grid, windows, or taskbar. */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="xp-desktop-vignette" />
        <div className="xp-desktop-bloom" />
        <div className="xp-desktop-crt" />
      </div>

      {/* Icons grid — z-20, always above background FX */}
      <div className="grid grid-flow-col grid-rows-6 gap-1 p-2 auto-cols-max relative z-20">
        {ICONS.map((ic) => (
          <button
            key={ic.id}
            onClick={(e) => { e.stopPropagation(); sfx.click(); setSelected(ic.id); }}
            onDoubleClick={() => { sfx.click(); ic.open(); }}
            className="flex flex-col items-center gap-1 w-20 p-1 rounded"
            style={{
              background: selected === ic.id ? "rgba(49,106,197,0.4)" : "transparent",
              outline: selected === ic.id ? "1px dotted white" : "none",
            }}
          >
            <span className="text-4xl drop-shadow-lg">{ic.icon}</span>
            <span
              className="text-[11px] text-white text-center leading-tight"
              style={{ textShadow: "1px 1px 2px #000, 0 0 2px #000" }}
            >
              {ic.label}
            </span>
          </button>
        ))}
      </div>

      {/* Konami hint (bottom-right, subtle) */}
      <div className="fixed bottom-10 right-2 text-white/40 text-[9px] italic pointer-events-none z-20 select-none" style={{ textShadow: "1px 1px 2px #000" }}>
        psst… try ⬆⬆⬇⬇⬅➡⬅➡ B A
      </div>

      {/* Windows */}
      {windows.map((w) => (
        <WindowFrame key={w.id} w={w}>
          {w.url ? (
            <iframe src={w.url} className="w-full h-full border-0 bg-white" title={w.title} />
          ) : w.content === "mycomputer" ? (
            <MyComputer />
          ) : w.content === "recycle" ? (
            <RecycleBin />
          ) : w.content === "notepad" ? (
            <Notepad />
          ) : null}
        </WindowFrame>
      ))}

      <Taskbar onStart={() => setStartOpen((s) => !s)} />
      <StartMenu open={startOpen} onClose={() => setStartOpen(false)} />

      {error && <XPError onClose={() => setError(false)} />}
      {modern && <ModernMode onClose={() => setModern(false)} />}
    </div>
  );
}

function MyComputer() {
  const items = [
    { icon: "💾", label: "Local Disk (C:)", sub: "27.4 GB free of 40 GB" },
    { icon: "💿", label: "DVD-RW Drive (D:)", sub: "NETFLIX_2006" },
    { icon: "📁", label: "My Documents", sub: "" },
    { icon: "🖨", label: "Printers and Faxes", sub: "" },
    { icon: "🎛", label: "Control Panel", sub: "" },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#ece9d8] border-b border-gray-400 px-2 py-1 text-[11px]">
        <span className="mr-3">File</span><span className="mr-3">Edit</span><span className="mr-3">View</span><span className="mr-3">Favorites</span><span>Help</span>
      </div>
      <div className="flex-1 p-4 grid grid-cols-3 gap-4 overflow-auto">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center text-center">
            <div className="text-5xl">{it.icon}</div>
            <div className="text-[11px] font-bold">{it.label}</div>
            <div className="text-[10px] text-gray-600">{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecycleBin() {
  return (
    <div className="p-6 text-center text-[12px] space-y-2">
      <div className="text-6xl">🗑</div>
      <div className="font-bold">Recycle Bin is empty</div>
      <div className="text-[10px] text-gray-600 italic">…except for HD-DVD, Blockbuster, and 3 unfinished MySpace layouts.</div>
    </div>
  );
}

function Notepad() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#ece9d8] border-b border-gray-400 px-2 py-1 text-[11px]">
        <span className="mr-3">File</span><span className="mr-3">Edit</span><span>Format</span>
      </div>
      <textarea
        readOnly
        defaultValue={`README.txt

NETFLIX 2006: THE FUTURE THAT ARRIVED TOO EARLY
================================================

We imagined what would happen if the Netflix of 2026
had to survive using only the technology available in 2006.

- AI recommendations delivered by CineBot 1.0 on MSN
- Streaming crammed through a 56k modem
- DVD logistics tracked like FedEx
- Push notifications replaced with a telephone call

Try ⬆⬆⬇⬇⬅➡⬅➡ B A for a glimpse of the future.
`}
        className="flex-1 w-full font-mono text-[12px] p-2 outline-none resize-none bg-white"
      />
    </div>
  );
}
