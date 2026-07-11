## Netflix 2006: "The Future That Arrived Too Early"

Turn the current app into a full **Windows XP desktop experience** where Netflix is one of several launchable apps. Keep the existing routes/AI/queue logic, but wrap everything in an XP boot → desktop → windowed-app shell, and layer on the story features (DVD logistics, dial-up streaming, CineBot, Konami → 2026 mode).

---

### Phase 1 — XP Desktop Shell (the wow-factor foundation)

1. **New `/` boot experience** (replaces current landing):
   - Black screen → BIOS text → Windows XP boot logo with animated progress bar → login screen ("Welcome — user: Reed Hastings") → play XP startup sound → fade to Bliss desktop.
2. **Desktop layer** (`src/components/desktop/Desktop.tsx`):
   - Bliss-style wallpaper, draggable desktop icons: 🖥 My Computer, 📁 Documents, 🎬 **Netflix**, 📼 DVD Collection, 💬 CineBot (MSN), 🗑 Recycle Bin, IE icon.
   - Double-click launches an XP window. Single-click selects (blue highlight).
   - Real XP taskbar: green Start button (opens Start menu with app list), running-app buttons, system tray with clock, 🔊, 📶 connection speed toggle (56k ↔ 512k), MSN pop-up.
3. **Window manager** (`src/lib/windows.tsx`):
   - Zustand-style store for open windows: id, title, icon, route/component, position, size, minimized, z-index, focused.
   - Draggable XP-chrome windows with `_ □ ✕` controls that actually minimize/maximize/close. Existing routes render **inside** these windows via an iframe-less portal (route content rendered as the window body).
   - Multiple apps open simultaneously; taskbar reflects them.

### Phase 2 — Netflix app (rework existing routes as windowed content)

Keep TanStack routes but render them inside XP windows launched from the desktop. Navigating within Netflix stays inside its window.

- **Home**: glossy Media-Center hero + DVD-shelf rows (real 3D-ish DVD case CSS mockups with spine + reflection, not flat cards).
- **Browse**: Blockbuster-style category shelves (Comedy / Action / Sci-Fi / Kids).
- **Watch page** → **"Insert DVD"** flow:
  - Click "Insert DVD" → DVD tray animation (disc spins) → Windows Media Player 10 window opens.
  - Connection sequence: `Connecting… 56kbps Modem → Authenticating → Loading Codec → Buffering → Playing` with dial-up modem SFX.
  - Quality selector: 144p / 240p / 360p (HD 🔒 "Requires Internet From The Future™").
  - On end → **"Return DVD"** dialog (Schedule Pickup / Return Tomorrow / Lost DVD) → recommends next DVD.
- **Queue** → **DVD Queue** with FedEx-style tracker: Warehouse → Packaging → Courier → Delivered, animated per item. "Preparing shipment" progress bar, "Estimated arrival: 2 days".
- **Notifications** (new): instead of push, choose ☎ Phone / 📧 Email / 📱 SMS reminder — shows a mocked confirmation ("We'll call 555-0142 when your DVD ships").

### Phase 3 — CineBot 1.0 (MSN Messenger window)

- Separate desktop app; opens as an MSN Messenger-styled window (title bar with buddy avatar, contact status, comic-sans-ish body font swap only inside this window).
- Uses existing `ai.functions.ts` `recommendMovies` — no backend change.
- Rebrand to **CineBot 1.0**, add "nudge" (window shakes), typing indicator with `...`, "Analyzing Ratings → Finding Similar Users → Computing Taste Profile → Done!" fake hacker log before the AI answer streams in.

### Phase 4 — Dial-Up Mode (global toggle)

- System-tray icon toggles 56k vs 512k.
- 56k mode: adds 1.5–3s artificial delay to every route/window open, degrades images with a `filter: contrast + pixelated` + progressive top-to-bottom reveal, plays modem SFX on first toggle.

### Phase 5 — Easter eggs & finale

- **Konami code** (⬆⬆⬇⬇⬅➡⬅➡BA): triggers "Netflix 2026 Mode" — fades XP chrome away, morphs into a clean modern Netflix UI (dark background, sans-serif, flat cards) using existing MOVIES data. Toggle back with Esc.
- **Random XP error dialogs**: rare `Error 0x00007 — Movie Cannot Be Streamed` with ding SFX + OK button.
- **Sounds**: XP startup, button click, DVD insert, dial-up handshake, error ding, MSN nudge. Small royalty-free/synthesized WAVs.
- **Cursor**: XP arrow + hand cursors via CSS `cursor: url(...)`.

---

### Technical notes

- **Stack**: existing TanStack Start + Tailwind v4. No backend changes. All state in-memory + localStorage.
- **New files**: `src/components/desktop/{Desktop,DesktopIcon,Taskbar,StartMenu,WindowFrame,BootSequence}.tsx`, `src/lib/window-manager.ts`, `src/lib/sounds.ts`, `src/lib/dialup.ts`, `src/components/apps/{MyComputer,RecycleBin,MSNCineBot,MediaPlayer,DVDCase}.tsx`, `src/components/ModernMode.tsx` (Konami).
- **Routing**: `/` becomes boot → desktop. Existing `/home`, `/browse`, `/queue`, `/watch/$id`, `/assistant`, `/account` still work as URLs but are rendered inside the Netflix window (window content is the current `<Outlet>`-style page body without the old `DesktopShell` wrapper — refactor `DesktopShell` → `WindowFrame`).
- **Assets**: generate 1 wallpaper JPG, 1 XP-style logo PNG, 1 DVD-case template PNG via imagegen. Sounds inlined as small base64 WAVs or from a free CDN.
- **Fonts**: keep Tahoma stack; add Trebuchet MS fallback. Modern-mode swaps to Inter.

### Out of scope (unless you ask)

- Real backend/auth/DB.
- Draggable window resize handles (windows will be draggable + min/max/close only, not free resize).
- Fully offline SFX library (will use a few small clips only).

Shipping in that order so each phase is independently demoable. Approve and I'll start with Phase 1 (boot + desktop + window manager) since everything else plugs into it.