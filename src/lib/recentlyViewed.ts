"use client";

import { useEffect, useState } from "react";

export type RecentItem = { slug: string; name: string; price: string; image: string };

const KEY = "brasa:recentlyViewed";
const MAX = 4;

function read(): RecentItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentItem[]).filter((i) => i && i.slug) : [];
  } catch {
    return [];
  }
}

function write(items: RecentItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode, blocked) — ignore */
  }
}

/**
 * Reads the recently-viewed list on mount (hydration-safe: starts empty).
 * Pass `record` to also log a view of the current product — it is moved to the
 * front, de-duplicated by slug, and the list is capped. Both the shop page and
 * the product page use this, so a product viewed on one appears on the other.
 */
export function useRecentlyViewed(record?: RecentItem): RecentItem[] {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    let next: RecentItem[];
    if (record?.slug) {
      next = [record, ...read().filter((i) => i.slug !== record.slug)].slice(0, MAX);
      write(next);
    } else {
      next = read();
    }
    // Reading persisted state after mount is exactly what this effect is for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(next);
    // Re-run only when the recorded product changes (record object is new each render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.slug]);

  return items;
}
