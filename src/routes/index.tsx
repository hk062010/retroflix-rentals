import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { XPWindow } from "@/components/XPChrome";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("guest");
  const [password, setPassword] = useState("password");
  const [remember, setRemember] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing modem...");

  useEffect(() => {
    if (!connecting) return;
    const steps = [
      "Initializing modem...",
      "Dialing 1-800-NETFLIX...",
      "Handshaking at 56.6 Kbps...",
      "Verifying credentials...",
      "Loading DVD catalog...",
      "Welcome back!",
    ];
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setStatusText(steps[Math.min(i, steps.length - 1)]);
      setProgress(Math.min(100, (i / steps.length) * 100));
      if (i >= steps.length) {
        clearInterval(t);
        setTimeout(() => navigate({ to: "/home" }), 400);
      }
    }, 600);
    return () => clearInterval(t);
  }, [connecting, navigate]);

  return (
    <div className="xp-desktop min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <XPWindow title="Netflix.com — Sign In" icon="🔐">
          <div className="p-6 relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-md bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white text-4xl border-2 border-white shadow-lg">
                👤
              </div>
              <div>
                <div className="netflix-logo text-3xl">NETFLIX</div>
                <div className="text-[10px] italic text-gray-700">est. 2006 · DVDs by Mail</div>
              </div>
            </div>

            {!connecting ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setConnecting(true);
                }}
                className="xp-groupbox space-y-3"
              >
                <label className="block">
                  <span className="text-[11px] block mb-1">Username or Email:</span>
                  <input
                    className="xp-input w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] block mb-1">Password:</span>
                  <input
                    type="password"
                    className="xp-input w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
                <label className="flex items-center gap-2 text-[11px]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me on this computer
                </label>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" className="xp-btn">Cancel</button>
                  <button type="submit" className="xp-btn-primary">Sign In →</button>
                </div>
              </form>
            ) : (
              <div className="xp-groupbox space-y-3">
                <div className="text-[12px] font-bold">📞 Dial-Up Connection</div>
                <div className="text-[11px] xp-blink">{statusText}</div>
                <div className="xp-progress">
                  {Array.from({ length: Math.floor(progress / 5) }).map((_, i) => (
                    <div key={i} className="xp-progress-block" />
                  ))}
                </div>
                <div className="text-[10px] text-gray-600">
                  Please do not pick up the telephone during connection.
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-[10px] text-gray-600">
              New to Netflix? <a className="text-blue-800 underline" href="#">Start Your Free Trial</a>
            </div>
          </div>
        </XPWindow>
        <div className="text-center text-white text-[10px] mt-2 drop-shadow">
          © 2006 Netflix, Inc. · Best viewed in Internet Explorer 6 at 1024×768
        </div>
      </div>
    </div>
  );
}
