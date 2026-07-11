import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { getQueue, type QueueItem } from "@/lib/queue";
import { getProfile, clearProfile, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — Netflix 2006" }] }),
});

function AccountPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const sync = () => {
      setProfile(getProfile());
      setQueue(getQueue());
    };
    sync();
    window.addEventListener("queue-updated", sync);
    window.addEventListener("profile-updated", sync);
    return () => {
      window.removeEventListener("queue-updated", sync);
      window.removeEventListener("profile-updated", sync);
    };
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      clearProfile();
      navigate({ to: "/" });
    }, 900);
  };

  const shipped = queue.filter((q) => q.status === "Shipped").length;
  const preparing = queue.filter((q) => q.status === "Preparing").length;
  const delivered = queue.filter((q) => q.status === "Delivered").length;
  const next = queue[0];

  const memberSince = profile
    ? new Date(profile.signedInAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <DesktopShell>
      <XPWindow title="My Account — Netflix.com" icon="👤">
        <NavBar />
        <div className="p-4 bg-white space-y-4">
          <div className="netflix-bar px-3 py-2 font-bold text-sm flex items-center justify-between">
            <span>👤 Account Information</span>
            <span className="text-[11px] font-normal">
              Signed in as <b>{profile?.username ?? "guest"}</b>
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Signed-in user card */}
            <div className="xp-groupbox space-y-2 text-[12px]">
              <div className="font-bold text-[13px] border-b border-gray-400 pb-1">
                Signed-In User
              </div>
              <div className="flex items-center gap-3 py-2">
                <div className="w-14 h-14 rounded-md bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white text-2xl border-2 border-white shadow">
                  {(profile?.username ?? "G").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[13px]">
                    {profile?.username ?? "guest"}
                  </div>
                  <div className="text-gray-700 text-[11px]">
                    {profile?.email ?? "guest@netflix.com"}
                  </div>
                  <div className="text-green-700 text-[10px] font-bold mt-0.5">
                    ● Online via Dial-Up
                  </div>
                </div>
              </div>
              <Row label="Session Started" value={memberSince} />
              <Row label="Login Method" value="XP Dial-Up (56.6 Kbps)" />
              <div className="flex gap-2 pt-2">
                <button
                  className="xp-btn-primary flex-1"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Disconnecting…" : "🔌 Log Out"}
                </button>
                <button className="xp-btn">Edit Profile</button>
              </div>
              {loggingOut && (
                <div className="text-[10px] xp-blink text-gray-700">
                  Hanging up modem… please wait.
                </div>
              )}
            </div>

            {/* Queue summary card */}
            <div className="xp-groupbox space-y-2 text-[12px]">
              <div className="font-bold text-[13px] border-b border-gray-400 pb-1">
                My Queue Summary
              </div>
              <Row label="DVDs in Queue" value={String(queue.length)} />
              <Row label="📦 Shipped" value={String(shipped)} />
              <Row label="🏭 Preparing" value={String(preparing)} />
              <Row label="✅ Delivered" value={String(delivered)} />
              <div className="border-t border-dashed border-gray-300 pt-2 mt-2">
                <div className="text-[11px] text-gray-700 mb-1">Next Up:</div>
                {next ? (
                  <Link
                    to="/watch/$id"
                    params={{ id: next.id }}
                    className="text-blue-800 underline font-bold text-[12px]"
                  >
                    ▶ Movie #{next.id} — {next.status}
                  </Link>
                ) : (
                  <div className="text-gray-500 italic text-[11px]">
                    Your queue is empty. Add a DVD to get started!
                  </div>
                )}
              </div>
              <Link to="/queue" className="xp-btn-primary inline-block mt-2">
                Manage Queue →
              </Link>
            </div>

            {/* Membership */}
            <div className="xp-groupbox space-y-2 text-[12px]">
              <div className="font-bold text-[13px] border-b border-gray-400 pb-1">
                Membership
              </div>
              <Row label="Plan" value="3 DVDs out at-a-time (Unlimited)" />
              <Row label="Monthly Price" value="$17.99" />
              <Row label="Member Since" value={memberSince} />
              <Row label="Next Billing" value="December 15, 2006" />
              <button className="xp-btn mt-2">Change Plan</button>
            </div>

            {/* Connection */}
            <div className="xp-groupbox space-y-2 text-[12px]">
              <div className="font-bold text-[13px] border-b border-gray-400 pb-1">
                Connection
              </div>
              <Row label="Connection Type" value="Dial-up (56.6 Kbps)" />
              <Row label="Streaming Quality" value="240p (default)" />
              <Row label="Browser" value="Internet Explorer 6" />
              <Row label="Screen" value="1024 × 768" />
            </div>
          </div>
        </div>
      </XPWindow>
    </DesktopShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-dashed border-gray-300 py-0.5">
      <span className="text-gray-700">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
