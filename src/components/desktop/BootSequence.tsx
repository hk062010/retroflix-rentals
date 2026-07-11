import { useEffect, useState } from "react";
import { sfx } from "@/lib/sounds";
import { saveProfile, getProfile } from "@/lib/profile";

type Phase = "bios" | "boot" | "login" | "connect" | "done";

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [username, setUsername] = useState("reed");
  const [password, setPassword] = useState("••••••••");
  const [connectStep, setConnectStep] = useState(0);

  useEffect(() => {
    if (phase === null) {
      const booted = typeof window !== "undefined" && sessionStorage.getItem("booted");
      setUsername(getProfile()?.username ?? "reed");
      setPhase(booted ? "done" : "bios");
      return;
    }
    if (phase === "done") { onDone(); return; }
    if (phase === "bios") {
      const t = setTimeout(() => setPhase("boot"), 1400);
      return () => clearTimeout(t);
    }
    if (phase === "boot") {
      const t = setTimeout(() => setPhase("login"), 2800);
      return () => clearTimeout(t);
    }
    if (phase === "connect") {
      sfx.modem();
      const steps = ["Initializing modem…", "Dialing 1-800-NETFLIX…", "Handshaking at 56.6 Kbps…", "Verifying credentials…", "Loading DVD catalog…", "Welcome to Netflix.com!"];
      let i = 0;
      const t = setInterval(() => {
        i++;
        setConnectStep(i);
        if (i >= steps.length) {
          clearInterval(t);
          sessionStorage.setItem("booted", "1");
          sfx.startup();
          setTimeout(() => { setPhase("done"); onDone(); }, 500);
        }
      }, 500);
      return () => clearInterval(t);
    }
  }, [phase, onDone]);

  if (phase === null || phase === "done") return null;

  if (phase === "bios") {
    return (
      <div className="fixed inset-0 z-[10000] bg-black text-green-400 font-mono text-[13px] p-6 leading-relaxed">
        <div>Award Modular BIOS v6.00PG, An Energy Star Ally</div>
        <div>Copyright (C) 1984-2006, Award Software, Inc.</div>
        <div className="mt-4">NETFLIX-XP 2006 · Detecting IDE drives…</div>
        <div>Primary Master: MAXTOR 40GB</div>
        <div>Primary Slave: HITACHI DVD-RW</div>
        <div className="mt-4 xp-blink">Press DEL to enter SETUP · Booting from HDD…</div>
      </div>
    );
  }

  if (phase === "boot") {
    return (
      <div className="fixed inset-0 z-[10000] bg-black text-white flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color: "#ff9c00", textShadow: "0 0 20px rgba(255,156,0,0.5)" }}>
            Microsoft®
          </div>
          <div className="text-6xl font-bold tracking-wide" style={{
            background: "linear-gradient(180deg,#e0e0ff 0%,#8090c0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Windows<span className="text-xs align-super ml-1">XP</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Netflix Edition</div>
        </div>
        <div className="w-64 h-3 border border-blue-800 overflow-hidden bg-black">
          <div
            className="h-full"
            style={{
              width: "40%",
              background: "linear-gradient(90deg,transparent, #3399ff, transparent)",
              animation: "bootbar 1.2s linear infinite",
            }}
          />
        </div>
        <style>{`@keyframes bootbar { 0%{transform:translateX(-100%)}100%{transform:translateX(400%)} }`}</style>
      </div>
    );
  }

  if (phase === "login") {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{
        background: "linear-gradient(180deg,#5b7fc4 0%,#3155a4 50%,#233f8a 100%)",
      }}>
        <div className="w-full max-w-3xl">
          <div className="text-white text-center mb-6">
            <div className="text-2xl">Welcome to Windows XP</div>
            <div className="text-[11px] opacity-70">Netflix Edition · Please select your user</div>
          </div>
          <div className="mx-auto w-fit bg-white/5 border-t-2 border-b-2 border-white/20 backdrop-blur p-6 flex gap-8">
            <button
              className="flex items-center gap-4 text-white hover:bg-white/10 p-3 rounded transition"
              onClick={() => {
                saveProfile({ username, email: `${username}@netflix.com`, signedInAt: Date.now() });
                setPhase("connect");
              }}
            >
              <div className="w-20 h-20 rounded bg-gradient-to-br from-red-600 to-red-900 border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                👤
              </div>
              <div className="text-left">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent text-xl font-medium border-b border-white/30 focus:outline-none focus:border-white"
                />
                <div className="text-[11px] opacity-70 mt-1">DVD Subscriber</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 bg-white/10 text-white text-[11px] px-2 py-1 rounded border border-white/20 focus:outline-none"
                  placeholder="Password"
                />
              </div>
            </button>
            <div className="flex items-center gap-4 text-white/50">
              <div className="w-20 h-20 rounded bg-white/10 border-4 border-white/30 flex items-center justify-center text-4xl">🐧</div>
              <div>
                <div className="text-lg">Guest</div>
                <div className="text-[11px]">Disabled</div>
              </div>
            </div>
          </div>
          <div className="text-white/70 text-[11px] text-center mt-6 italic">
            To begin, click your user name. Passwords accepted since 2001.
          </div>
        </div>
      </div>
    );
  }

  // connect
  const steps = ["Initializing modem…", "Dialing 1-800-NETFLIX…", "Handshaking at 56.6 Kbps…", "Verifying credentials…", "Loading DVD catalog…", "Welcome to Netflix.com!"];
  return (
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
      <div className="xp-window w-[420px]">
        <div className="xp-titlebar">
          <span className="xp-hourglass">⌛</span>
          <span className="flex-1">Connect to Netflix.com</span>
        </div>
        <div className="p-4 bg-[color:var(--xp-window)] space-y-3">
          <div className="text-[12px] font-bold">📞 Dialing…</div>
          <div className="text-[11px] xp-blink">{steps[Math.min(connectStep, steps.length - 1)]}</div>
          <div className="xp-progress-animated">
            <div className="xp-progress-fill" style={{ animationDuration: "3s" }} />
          </div>
          <div className="text-[10px] text-gray-600">Please do not pick up the telephone during connection.</div>
        </div>
      </div>
    </div>
  );
}
