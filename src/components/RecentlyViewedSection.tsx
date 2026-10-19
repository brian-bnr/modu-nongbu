"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentlyViewed, type RecentlyViewedItem } from "@/lib/recentlyViewed";
import { formatPrice } from "@/lib/format";

export function RecentlyViewedSection() {
  const [items, setItems] = useState<RecentlyViewedItem[] | null>(null);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  // 로딩 전(null)이거나 기록이 없으면 아예 렌더링하지 않는다 — 처음 방문자에게 빈 섹션을 보여주지 않기 위해.
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">최근 본 상품</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="relative h-28 w-32 shrink-0 snap-start overflow-hidden rounded-xl bg-brand-50 shadow-sm sm:h-32 sm:w-40"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-2 text-white">
              <p className="line-clamp-1 text-xs font-semibold">{item.title}</p>
              {item.price != null && (
                <p className="mt-0.5 text-[11px] opacity-90">
                  {formatPrice(item.price)}
                  {item.unit ? ` / ${item.unit}` : ""}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
