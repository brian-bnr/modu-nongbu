"use client";

import { useEffect } from "react";
import { recordRecentlyViewed, type RecentlyViewedItem } from "@/lib/recentlyViewed";

export function RecentlyViewedTracker({ item }: { item: RecentlyViewedItem }) {
  useEffect(() => {
    recordRecentlyViewed(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  return null;
}
