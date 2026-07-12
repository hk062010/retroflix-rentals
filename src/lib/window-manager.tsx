import { useSyncExternalStore } from "react";

export type AppId = "netflix" | "cinebot" | "mycomputer" | "recycle" | "ie" | "mediaplayer" | "notepad";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  url?: string; // if set, render as iframe
  content?: "mycomputer" | "recycle" | "notepad" | "mediaplayer";
  contentProps?: Record<string, unknown>;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; w: number; h: number };
};

type Store = {
  windows: WindowState[];
  focus: string | null;
  zTop: number;
};

let state: Store = { windows: [], focus: null, zTop: 100 };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (next: Partial<Store>) => {
  state = { ...state, ...next };
  emit();
};

export const wm = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get(): Store {
    return state;
  },
  open(config: Omit<WindowState, "x" | "y" | "w" | "h" | "z" | "minimized" | "maximized"> & Partial<Pick<WindowState, "x" | "y" | "w" | "h">>) {
    const existing = state.windows.find((w) => w.appId === config.appId && w.id === config.id);
    if (existing) return wm.focus(existing.id);
    const z = state.zTop + 1;
    const offset = state.windows.length * 24;
    const w: WindowState = {
      x: 60 + offset,
      y: 40 + offset,
      w: 920,
      h: 620,
      minimized: false,
      maximized: false,
      z,
      ...config,
    };
    set({ windows: [...state.windows, w], zTop: z, focus: w.id });
  },
  close(id: string) {
    const remaining = state.windows.filter((w) => w.id !== id);
    const nextFocus = state.focus === id
      ? (remaining.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id ?? null)
      : state.focus;
    set({ windows: remaining, focus: nextFocus });
  },
  focus(id: string) {
    const z = state.zTop + 1;
    set({
      windows: state.windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)),
      zTop: z,
      focus: id,
    });
  },
  minimize(id: string) {
    const windows = state.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w));
    const nextFocus = state.focus === id
      ? (windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id ?? null)
      : state.focus;
    set({ windows, focus: nextFocus });
  },
  toggleMax(id: string) {
    set({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.prev) return { ...w, ...w.prev, maximized: false, prev: undefined };
        return { ...w, prev: { x: w.x, y: w.y, w: w.w, h: w.h }, x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - 40, maximized: true };
      }),
    });
  },
  move(id: string, x: number, y: number) {
    set({ windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)) });
  },
};

const serverSnap: Store = { windows: [], focus: null, zTop: 100 };
export function useWindows() {
  return useSyncExternalStore(wm.subscribe, wm.get, () => serverSnap);
}
