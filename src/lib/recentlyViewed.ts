const STORAGE_KEY = "mdfarm_recently_viewed";
const MAX_ITEMS = 10;

export type RecentlyViewedItem = {
  id: string;
  title: string;
  price: number | null;
  unit: string | null;
  imageUrl: string | null;
  href: string;
};

export function recordRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyViewed().filter((i) => i.id !== item.id);
    const next = [item, ...existing].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage를 못 쓰는 환경(시크릿모드 등)에서는 조용히 무시한다.
  }
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
