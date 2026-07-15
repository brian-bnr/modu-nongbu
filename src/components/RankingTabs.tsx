"use client";

import { useState } from "react";
import type { Post, User } from "@prisma/client";
import { PostCard } from "@/components/PostCard";

type RankingPost = Post & { author: User; _count: { inquiries: number } };

const RANK_BADGE_COLOR = ["bg-amber-400", "bg-slate-400", "bg-orange-400"];

export function RankingTabs({
  realtime,
  weekly,
}: {
  realtime: RankingPost[];
  weekly: RankingPost[];
}) {
  const [tab, setTab] = useState<"realtime" | "weekly">("realtime");
  const posts = tab === "realtime" ? realtime : weekly;

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("realtime")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "realtime"
              ? "bg-brand-700 text-white"
              : "bg-black/5 text-black/60 hover:bg-black/10"
          }`}
        >
          실시간
        </button>
        <button
          type="button"
          onClick={() => setTab("weekly")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "weekly"
              ? "bg-brand-700 text-white"
              : "bg-black/5 text-black/60 hover:bg-black/10"
          }`}
        >
          주간
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-black/50">
          최근 7일간 등록된 글이 없어요.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {posts.map((post, i) => (
            <div key={post.id} className="relative">
              <span
                className={`absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                  RANK_BADGE_COLOR[i] ?? "bg-black/40"
                }`}
              >
                {i + 1}
              </span>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
