import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  const posts = query
    ? await prisma.post.findMany({
        where: { title: { contains: query } },
        take: 30,
        orderBy: { createdAt: "desc" },
        include: { author: true },
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">검색</h1>
      <form method="get" className="mt-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="농산물, 일자리 제목으로 검색"
          className="w-full max-w-md rounded-md border border-black/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          검색
        </button>
      </form>

      {!query ? (
        <p className="mt-8 text-sm text-black/50">검색어를 입력해보세요.</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 text-sm text-black/50">
          &quot;{query}&quot;에 대한 검색 결과가 없어요.
        </p>
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
