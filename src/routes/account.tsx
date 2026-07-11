import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { XPWindow, NavBar, DesktopShell } from "@/components/XPChrome";
import { getQueue } from "@/lib/queue";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — Netflix 2006" }] }),
});

function AccountPage() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(getQueue().length);
    const h = () => setCount(getQueue().length);
    window.addEventListener("queue-updated", h);
    return () => window.removeEventListener("queue-updated", h);
  }, []);

  return (
    <DesktopShell>
      <XPWindow title="My Account — Netflix.com" icon="👤">
        <NavBar />
        <div className="p-4 bg-white space-y-4">
          <div className="netflix-bar px-3 py-2 font-bold text-sm">👤 Account Information</div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="xp-groupbox space-y-2 text-[12px]">
              <div className="font-bold text-[13px] border-b border-gray-400 pb-1">
                Membership
              </div>
              <Row label="Plan" value="3 DVDs out at-a-time (Unlimited)" />
              <Row label="Monthly Price" value="$17.99" />
              <Row label="Member Since" value="August 29, 2006" />
              <Row label="Next Billing" value="December 15, 2006" />
              <button className="xp-btn mt-2">Change Plan</button>
            </div>

            <div className="xp-groupbox space-y-2 text-[12px]">
              <div className="font-bold text-[13px] border-b border-gray-400 pb-1">
                Shipping Address
              </div>
              <div>Guest User</div>
              <div>1 Netflix Way</div>
              <div>Los Gatos, CA 95032</div>
              <div>United States</div>
              <button className="xp-btn mt-2">Edit Address</button>
            </div>

            <div className="xp-groupbox space-y-2 text-[12px]">
              <div className="font-bold text-[13px] border-b border-gray-400 pb-1">
                DVD Activity
              </div>
              <Row label="DVDs in Queue" value={String(count)} />
              <Row label="DVDs Rented" value="47" />
              <Row label="Ratings Given" value="128" />
              <Link to="/queue" className="xp-btn-primary inline-block mt-2">
                Manage Queue
              </Link>
            </div>

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
