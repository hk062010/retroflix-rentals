import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BootSequence } from "@/components/desktop/BootSequence";
import { Desktop } from "@/components/desktop/Desktop";

export const Route = createFileRoute("/")({
  component: Shell,
  head: () => ({
    meta: [{ title: "Netflix 2006 — The Future That Arrived Too Early" }],
  }),
});

function Shell() {
  const [ready, setReady] = useState(false);
  return (
    <>
      {ready && <Desktop />}
      <BootSequence onDone={() => setReady(true)} />
    </>
  );
}
