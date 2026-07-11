import { sfx } from "@/lib/sounds";
import { wm } from "@/lib/window-manager";
import { getProfile } from "@/lib/profile";
import { useEffect, useState } from "react";

const APPS: Array<{ icon: string; label: string; run: () => void }> = [
  { icon: "🎬", label: "Netflix", run: () => wm.open({ id: "netflix", appId: "netflix", title: "Netflix.com — Microsoft Internet Explorer", icon: "🌐", url: "/home?embed=1", w: 960, h: 660 }) },
  { icon: "💬", label: "CineBot 1.0 (Messenger)", run: () => wm.open({ id: "cinebot", appId: "cinebot", title: "CineBot 1.0 — MSN Movie Messenger", icon: "💬", url: "/assistant?embed=1", w: 560, h: 640 }) },
  { icon: "📀", label: "Browse DVDs", run: () => wm.open({ id: "browse", appId: "netflix", title: "Browse DVDs — Netflix.com", icon: "📀", url: "/browse?embed=1", w: 960, h: 640 }) },
  { icon: "📬", label: "My DVD Queue", run: () => wm.open({ id: "queue", appId: "netflix", title: "My DVD Queue — Netflix.com", icon: "📬", url: "/queue?embed=1", w: 900, h: 620 }) },
  { icon: "👤", label: "Account", run: () => wm.open({ id: "account", appId: "netflix", title: "My Account — Netflix.com", icon: "👤", url: "/account?embed=1", w: 900, h: 600 }) },
  { icon: "🖥", label: "My Computer", run: () => wm.open({ id: "mycomp", appId: "mycomputer", title: "My Computer", icon: "🖥", content: "mycomputer", w: 560, h: 400 }) },
  { icon: "🗑", label: "Recycle Bin", run: () => wm.open({ id: "recycle", appId: "recycle", title: "Recycle Bin", icon: "🗑", content: "recycle", w: 500, h: 360 }) },
];

export function StartMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [user, setUser] = useState("guest");
  useEffect(() => {
    setUser(getProfile()?.username ?? "guest");
  }, [open]);
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div
        className="fixed z-[9999] w-[340px] rounded-t-md overflow-hidden shadow-2xl"
        style={{
          left: 0, bottom: 36,
          border: "1px solid #0d3d9e",
          background: "#fff",
        }}
      >
        <div
          className="px-3 py-2 flex items-center gap-2 text-white"
          style={{
            background: "linear-gradient(180deg,#3491f2 0%,#1560c9 40%,#0146c4 100%)",
            borderBottom: "2px solid #ff9c00",
          }}
        >
          <div className="w-11 h-11 rounded bg-red-800 flex items-center justify-center text-2xl border-2 border-white shadow">
            {user.charAt(0).toUpperCase()}
          </div>
          <div className="font-bold text-[13px] drop-shadow">{user}</div>
        </div>
        <div className="grid grid-cols-2 bg-white">
          <div className="p-2 space-y-1 border-r border-gray-300" style={{ background: "linear-gradient(to right,#f5f5f5 90%,#e8e8e8)" }}>
            {APPS.slice(0, 5).map((a) => (
              <button
                key={a.label}
                onClick={() => { sfx.click(); a.run(); onClose(); }}
                className="flex items-center gap-2 w-full text-left text-[12px] px-2 py-1.5 hover:bg-blue-600 hover:text-white rounded"
              >
                <span className="text-xl">{a.icon}</span>
                <span className="font-bold">{a.label}</span>
              </button>
            ))}
          </div>
          <div className="p-2 space-y-1" style={{ background: "linear-gradient(to right,#dfe8f3,#c9d8ee)" }}>
            {APPS.slice(5).map((a) => (
              <button
                key={a.label}
                onClick={() => { sfx.click(); a.run(); onClose(); }}
                className="flex items-center gap-2 w-full text-left text-[12px] px-2 py-1.5 hover:bg-blue-600 hover:text-white rounded"
              >
                <span className="text-xl">{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div
          className="flex justify-end gap-2 px-3 py-2 text-white text-[11px]"
          style={{ background: "linear-gradient(180deg,#1560c9,#0146c4)" }}
        >
          <button className="hover:underline" onClick={() => location.reload()}>🔒 Log Off</button>
          <button className="hover:underline" onClick={() => location.reload()}>⏻ Turn Off Computer</button>
        </div>
      </div>
    </>
  );
}
