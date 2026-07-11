import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { XPWindow, DesktopShell } from "@/components/XPChrome";
import { recommendMovies } from "@/lib/ai.functions";
import { sfx } from "@/lib/sounds";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
  head: () => ({ meta: [{ title: "CineBot 1.0 — MSN Messenger" }] }),
});

type Msg =
  | { role: "user" | "bot"; text: string; ts: string }
  | { role: "system"; text: string };

const USER_NAME = "you@netflix.com";
const BOT_NAME = "CineBot 1.0";
const EMOTES: Array<[string, string]> = [
  [":)", "🙂"], [":D", "😀"], [":P", "😛"], [";)", "😉"],
  [":(", "☹️"], ["<3", "❤️"], [":O", "😮"], ["8)", "😎"],
];

function nowStamp() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function AssistantPage() {
  const call = useServerFn(recommendMovies);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "system", text: `${BOT_NAME} has been added to the conversation.` },
    {
      role: "bot",
      ts: nowStamp(),
      text: "hey!! 🎬 im CineBot 1.0, ur personal movie picker. tell me wut ur in the mood for & ill dig thru the DVD catalog 4 u ✨",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nudging, setNudging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function insertEmote(sym: string) {
    setInput((v) => v + " " + sym + " ");
    inputRef.current?.focus();
  }

  function doNudge() {
    sfx.nudge();
    setNudging(true);
    setMessages((m) => [...m, { role: "system", text: "You have just sent a nudge." }]);
    setTimeout(() => setNudging(false), 700);
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q, ts: nowStamp() }]);
    setLoading(true);
    sfx.click();
    try {
      const { reply } = await call({ data: { message: q } });
      setMessages((m) => [...m, { role: "bot", text: reply, ts: nowStamp() }]);
      sfx.ding();
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          ts: nowStamp(),
          text: `⚠ connection dropped! ${err instanceof Error ? err.message : "try again"}`,
        },
      ]);
      sfx.error();
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <DesktopShell>
      <XPWindow title="CineBot 1.0 - Conversation" icon="💬">
        <div className="p-4 bg-[#5a7edb] min-h-screen" style={{ backgroundImage: "linear-gradient(135deg,#3b6fc4,#7ba7e1)" }}>
          <div
            ref={windowRef}
            className={`msn-window max-w-[560px] mx-auto ${nudging ? "msn-nudge" : ""}`}
          >
            {/* MSN title bar */}
            <div className="msn-titlebar">
              <span>💬</span>
              <span className="flex-1">CineBot 1.0 - Conversation</span>
              <span className="px-1 leading-none border border-white/40 bg-white/10">_</span>
              <span className="px-1 leading-none border border-white/40 bg-white/10">▢</span>
              <span className="px-1 leading-none border border-white/40 bg-red-500">✕</span>
            </div>

            {/* Menu bar */}
            <div className="msn-toolbar">
              <span><u>F</u>ile</span>
              <span><u>E</u>dit</span>
              <span><u>A</u>ctions</span>
              <span><u>T</u>ools</span>
              <span><u>H</u>elp</span>
            </div>

            {/* Contact header */}
            <div className="msn-header">
              <div className="msn-avatar">🎬</div>
              <div className="flex-1">
                <div className="text-[12px] font-bold text-[#003399]">
                  {BOT_NAME} <span className="text-[10px] text-gray-600 font-normal">&lt;cinebot@netflix.com&gt;</span>
                </div>
                <div className="text-[11px] text-gray-700 italic">
                  ♪ now watching: Napoleon Dynamite (2004) ♪
                </div>
              </div>
              <div className="text-right text-[10px] text-gray-600">
                <div className="flex items-center gap-1 justify-end">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="font-bold text-green-700">Online</span>
                </div>
                <div>MSN Messenger 7.5</div>
              </div>
            </div>

            {/* Chat area */}
            <div ref={scrollRef} className="msn-chat-area h-[340px]">
              {messages.map((m, i) => {
                if (m.role === "system") {
                  return <div key={i} className="msn-system-line">{m.text}</div>;
                }
                const isUser = m.role === "user";
                return (
                  <div key={i} className="mb-2">
                    <div className="msn-msg-name" style={{ color: isUser ? "#c0392b" : "#003399" }}>
                      {isUser ? USER_NAME : BOT_NAME} <span className="text-gray-500 font-normal text-[10px]">says ({m.ts}):</span>
                    </div>
                    <div className="msn-msg-text">{m.text}</div>
                  </div>
                );
              })}
              {loading && (
                <div className="text-[11px] text-gray-600 italic mt-1">
                  {BOT_NAME} is typing
                  <span className="msn-typing-dot" />
                  <span className="msn-typing-dot" />
                  <span className="msn-typing-dot" />
                </div>
              )}
            </div>

            {/* Input area */}
            <form onSubmit={send} className="msn-input-area">
              <div className="msn-input-toolbar">
                {EMOTES.map(([sym, emoji]) => (
                  <button
                    key={sym}
                    type="button"
                    className="msn-emote-btn"
                    title={sym}
                    onClick={() => insertEmote(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
                <span className="border-l border-gray-400 mx-1 h-4" />
                <button
                  type="button"
                  className="msn-emote-btn"
                  title="Send a nudge"
                  onClick={doNudge}
                >
                  ⚡ Nudge
                </button>
                <button
                  type="button"
                  className="msn-emote-btn"
                  title="Wink"
                  onClick={() => insertEmote("*wink*")}
                >
                  😉 Wink
                </button>
                <span className="ml-auto text-[10px] text-gray-500">
                  Font: <b>Tahoma</b>
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <textarea
                  ref={inputRef}
                  className="msn-textbox flex-1"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={loading}
                  rows={2}
                />
                <div className="flex flex-col gap-1">
                  <button type="submit" className="msn-send-btn" disabled={loading || !input.trim()}>
                    Send
                  </button>
                  <button type="button" className="msn-send-btn" onClick={doNudge} disabled={loading}>
                    Nudge!
                  </button>
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap gap-1">
                {[
                  "something funny 😂",
                  "scary movie for date night",
                  "action packed pls",
                  "family friendly",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="msn-emote-btn text-[10px] border border-[#7ba7e1] bg-white"
                    onClick={() => setInput(s)}
                    disabled={loading}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>

            {/* Status bar */}
            <div className="msn-status-bar">
              <span>
                {loading ? (
                  <>🕓 Waiting for {BOT_NAME}...</>
                ) : (
                  <>Last message received at {nowStamp()}</>
                )}
              </span>
              <span>🔒 Not encrypted</span>
            </div>
          </div>

          <div className="text-center text-white/80 text-[10px] mt-2 font-bold" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.4)" }}>
            .:: MSN Messenger 7.5 ::.  © 2006 Microsoft Corporation
          </div>
        </div>
      </XPWindow>
    </DesktopShell>
  );
}
