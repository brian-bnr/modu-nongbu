import Link from "next/link";
import type { PostStatus, PostType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { formatDate, POST_STATUS_LABEL, POST_STATUS_VARIANT, POST_TYPE_LABEL } from "@/lib/format";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        type ? { postType: type as PostType } : {},
        status ? { status: status as PostStatus } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">게시글 관리</h1>

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <select
          name="type"
          defaultValue={type ?? ""}
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          <option value="">전체 타입</option>
          {(Object.keys(POST_TYPE_LABEL) as PostType[]).map((t) => (
            <option key={t} value={t}>
              {POST_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          <option value="">전체 상태</option>
          <option value="OPEN">진행중</option>
          <option value="CLOSED">마감</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          필터
        </button>
      </form>

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">등록된 글이 없습니다.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/admin/posts/${post.id}`}
                className="flex h-full flex-col justify-between gap-2 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{post.title}</p>
                  <Badge variant={POST_STATUS_VARIANT[post.status]}>
                    {POST_STATUS_LABEL[post.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">{post.author.name}</p>
                  <p className="mt-0.5 text-xs text-black/40 dark:text-white/40">
                    {POST_TYPE_LABEL[post.postType]} · {formatDate(post.createdAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
