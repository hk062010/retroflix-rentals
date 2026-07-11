// Synthesized retro SFX via Web Audio API — no external assets needed.
let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const W = window as unknown as { webkitAudioContext?: typeof AudioContext };
    const Ctor = window.AudioContext ?? W.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function tone(freq: number, dur = 0.12, type: OscillatorType = "square", vol = 0.05, when = 0) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur);
}

export const sfx = {
  click: () => tone(1200, 0.03, "square", 0.03),
  ding: () => {
    tone(880, 0.12, "sine", 0.08);
    tone(1320, 0.16, "sine", 0.06, 0.06);
  },
  error: () => {
    tone(220, 0.15, "square", 0.08);
    tone(180, 0.18, "square", 0.08, 0.12);
  },
  startup: () => {
    tone(523, 0.18, "sine", 0.06);
    tone(659, 0.18, "sine", 0.06, 0.15);
    tone(784, 0.22, "sine", 0.06, 0.32);
    tone(1046, 0.32, "sine", 0.07, 0.5);
  },
  modem: () => {
    const seq: Array<[number, number, number]> = [
      [400, 0.15, 0], [800, 0.2, 0.15], [1200, 0.15, 0.4],
      [600, 0.3, 0.55], [1400, 0.2, 0.9], [900, 0.2, 1.1],
      [2100, 0.6, 1.3], [1800, 0.6, 1.35],
    ];
    seq.forEach(([f, d, w]) => tone(f, d, "sawtooth", 0.03, w));
  },
  nudge: () => {
    tone(700, 0.08, "triangle", 0.06);
    tone(500, 0.08, "triangle", 0.06, 0.08);
  },
  dvdSpin: () => {
    const c = ac();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.9);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 1.0);
  },
};
