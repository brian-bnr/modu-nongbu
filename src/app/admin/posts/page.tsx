import type { PostStatus, PostType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { PageIntro, StatTile, SectionCard, GridCard } from "@/components/admin/AdminUI";
import { requireAdmin } from "@/lib/auth";
import { formatDate, POST_STATUS_LABEL, POST_STATUS_VARIANT, POST_TYPE_LABEL } from "@/lib/format";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  await requireAdmin();

  const { type, status } = await searchParams;

  const [posts, totalCount, openCount, closedCount] = await Promise.all([
    prisma.post.findMany({
      where: {
        AND: [
          type ? { postType: type as PostType } : {},
          status ? { status: status as PostStatus } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    }),
    prisma.post.count(),
    prisma.post.count({ where: { status: "OPEN" } }),
    prisma.post.count({ where: { status: "CLOSED" } }),
  ]);

  return (
    <div>
      <PageIntro title="게시글 관리" subtitle={`전체 ${totalCount.toLocaleString("ko-KR")}건`} />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatTile label="전체 게시글" value={totalCount} color="green" delay={0} />
        <StatTile label="진행중" value={openCount} color="teal" delay={40} />
        <StatTile label="마감" value={closedCount} color="indigo" delay={80} />
      </div>

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

      <div className="mt-6">
        <SectionCard title="게시글 목록" tone="brand" delay={80}>
          {posts.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">등록된 글이 없습니다.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, i) => (
                <GridCard key={post.id} href={`/admin/posts/${post.id}`} delay={i * 30}>
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
                </GridCard>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
