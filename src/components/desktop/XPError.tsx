import { sfx } from "@/lib/sounds";

export function XPError({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.25)" }}>
      <div className="xp-window" style={{ width: 380 }}>
        <div className="xp-titlebar">
          <span>⚠</span>
          <span className="flex-1">Windows Media Player</span>
          <button className="xp-titlebar-btn" onClick={() => { sfx.click(); onClose(); }} style={{ background: "linear-gradient(180deg,#e56464 0%,#a41818 100%)" }}>✕</button>
        </div>
        <div className="p-4 bg-[color:var(--xp-window)] flex gap-3">
          <div className="text-5xl">🚫</div>
          <div className="text-[12px] flex-1">
            <div className="font-bold mb-1">Error 0x00007</div>
            <div>Movie cannot be streamed at this time. Please wait for buffering, then try again.</div>
            <div className="text-[10px] text-gray-600 mt-2">Tip: For best results, do not use the telephone while streaming.</div>
          </div>
        </div>
        <div className="bg-[color:var(--xp-window)] px-4 pb-3 flex justify-end gap-2">
          <button className="xp-btn-primary" onClick={() => { sfx.click(); onClose(); }}>OK</button>
          <button className="xp-btn" onClick={() => { sfx.ding(); onClose(); }}>Details »</button>
        </div>
      </div>
    </div>
  );
}
