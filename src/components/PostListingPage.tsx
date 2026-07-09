import Link from "next/link";
import type { PostType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export async function PostListingPage({
  heading,
  description,
  tabs,
  activeType,
  q,
  category,
  region,
  newHref,
  basePath,
}: {
  heading: string;
  description: string;
  tabs: { type: PostType; label: string }[];
  activeType: PostType;
  q?: string;
  category?: string;
  region?: string;
  newHref: string;
  basePath: string;
}) {
  const [posts, categories, regions] = await Promise.all([
    prisma.post.findMany({
      where: {
        AND: [
          { postType: activeType },
          q ? { title: { contains: q } } : {},
          category ? { category } : {},
          region ? { region } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    }),
    prisma.post.findMany({
      where: { postType: activeType, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
    prisma.post.findMany({
      where: { postType: activeType },
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">{description}</p>
        </div>
        <Link
          href={newHref}
          className="shrink-0 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          + 글쓰기
        </Link>
      </div>

      <div className="mt-4 flex gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.type}
            href={`${basePath}?type=${tab.type}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              tab.type === activeType
                ? "bg-brand-700 text-white"
                : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <input type="hidden" name="type" value={activeType} />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="제목 검색"
          className="w-56 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {categories.length > 0 && (
          <select
            name="category"
            defaultValue={category ?? ""}
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          >
            <option value="">전체 카테고리</option>
            {categories.map(
              (c) =>
                c.category && (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                )
            )}
          </select>
        )}
        {regions.length > 0 && (
          <select
            name="region"
            defaultValue={region ?? ""}
            className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          >
            <option value="">전체 지역</option>
            {regions.map((r) => (
              <option key={r.region} value={r.region}>
                {r.region}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          검색
        </button>
      </form>

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">조건에 맞는 글이 없습니다.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
