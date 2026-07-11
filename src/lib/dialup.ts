const KEY = "netflix2006-dialup";
export type Speed = "56k" | "512k";

export function getSpeed(): Speed {
  if (typeof window === "undefined") return "512k";
  return (localStorage.getItem(KEY) as Speed) || "512k";
}
export function setSpeed(s: Speed) {
  localStorage.setItem(KEY, s);
  window.dispatchEvent(new Event("dialup-updated"));
  document.documentElement.dataset.dialup = s;
}
export function initDialup() {
  if (typeof window === "undefined") return;
  document.documentElement.dataset.dialup = getSpeed();
}
