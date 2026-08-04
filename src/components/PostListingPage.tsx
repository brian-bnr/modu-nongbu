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
  sort,
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
  sort?: string;
  newHref: string;
  basePath: string;
}) {
  const orderBy =
    sort === "popular"
      ? [{ inquiries: { _count: "desc" as const } }, { createdAt: "desc" as const }]
      : { createdAt: "desc" as const };

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
      orderBy,
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

  function buildHref(overrides: Record<string, string | undefined>) {
    const merged: Record<string, string | undefined> = {
      type: activeType,
      q,
      category,
      region,
      sort,
      ...overrides,
    };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    return `${basePath}?${params.toString()}`;
  }

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
      active ? "bg-brand-700 text-white" : "bg-black/5 text-black/60 hover:bg-black/10"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="mt-1 text-sm text-black/50">{description}</p>
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
                : "bg-black/5 text-black/60 hover:bg-black/10"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href={buildHref({ category: undefined })} className={chipClass(!category)}>
            전체
          </Link>
          {categories.map(
            (c) =>
              c.category && (
                <Link
                  key={c.category}
                  href={buildHref({ category: c.category })}
                  className={chipClass(category === c.category)}
                >
                  {c.category}
                </Link>
              )
          )}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Link href={buildHref({ sort: undefined })} className={chipClass(sort !== "popular")}>
          최신순
        </Link>
        <Link href={buildHref({ sort: "popular" })} className={chipClass(sort === "popular")}>
          인기순
        </Link>
      </div>

      <form method="get" className="mt-4 flex flex-wrap gap-2">
        <input type="hidden" name="type" value={activeType} />
        <input type="hidden" name="category" value={category ?? ""} />
        <input type="hidden" name="sort" value={sort ?? ""} />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="제목 검색"
          className="w-56 rounded-md border border-black/10 px-3 py-2 text-sm"
        />
        {regions.length > 0 && (
          <select
            name="region"
            defaultValue={region ?? ""}
            className="rounded-md border border-black/10 px-3 py-2 text-sm"
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
        <p className="mt-8 text-sm text-black/50">조건에 맞는 글이 없습니다.</p>
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
