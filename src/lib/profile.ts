export type Profile = {
  username: string;
  email: string;
  signedInAt: number;
};

const KEY = "netflix2006-profile";

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("profile-updated"));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("profile-updated"));
}
