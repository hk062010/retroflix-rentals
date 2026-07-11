export type QueueStatus = "Preparing" | "Shipped" | "Delivered";
export type QueueItem = { id: string; status: QueueStatus; addedAt: number };

const KEY = "netflix2006-queue";

export function getQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveQueue(q: QueueItem[]) {
  localStorage.setItem(KEY, JSON.stringify(q));
  window.dispatchEvent(new Event("queue-updated"));
}

export function addToQueue(id: string) {
  const q = getQueue();
  if (q.find((i) => i.id === id)) return q;
  const idx = q.length;
  const status: QueueStatus = idx === 0 ? "Shipped" : idx === 1 ? "Preparing" : "Preparing";
  q.push({ id, status, addedAt: Date.now() });
  saveQueue(q);
  return q;
}

export function removeFromQueue(id: string) {
  const q = getQueue().filter((i) => i.id !== id);
  saveQueue(q);
  return q;
}

export function moveItem(id: string, dir: -1 | 1) {
  const q = getQueue();
  const idx = q.findIndex((i) => i.id === id);
  if (idx < 0) return q;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= q.length) return q;
  [q[idx], q[newIdx]] = [q[newIdx], q[idx]];
  saveQueue(q);
  return q;
}
