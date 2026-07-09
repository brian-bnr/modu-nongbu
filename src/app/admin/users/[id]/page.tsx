import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  formatDate,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_STATUS_LABEL,
  POST_STATUS_VARIANT,
  POST_TYPE_LABEL,
} from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);
const NEW_USER_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
      inquiries: { orderBy: { createdAt: "desc" }, include: { post: true } },
    },
  });

  if (!user) {
    notFound();
  }

  const isNew = Date.now() - user.createdAt.getTime() < NEW_USER_WINDOW_MS;

  return (
    <div>
      <Link
        href="/admin/users"
        className="text-sm text-brand-700 hover:underline dark:text-brand-400"
      >
        ← 회원 목록으로
      </Link>

      <div className="mt-2 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">{user.name}</p>
          {isNew && <Badge variant="amber">신규</Badge>}
        </div>
        <p className="mt-1 text-black/60 dark:text-white/60">
          {user.email} · {user.phone}
        </p>
        {user.region && <p className="mt-1 text-black/60 dark:text-white/60">{user.region}</p>}
        <p className="mt-2 text-xs text-black/40 dark:text-white/40">
          가입일 {formatDate(user.createdAt)}
        </p>
      </div>

      <h2 className="mt-8 text-lg font-semibold">이 회원이 올린 글 {user.posts.length}건</h2>
      {user.posts.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">올린 글이 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {user.posts.map((post) => {
            const base = JOB_TYPES.has(post.postType) ? "/jobs" : "/products";
            return (
              <li key={post.id}>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-black/40 dark:text-white/40">
                      {POST_TYPE_LABEL[post.postType]} · {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <Badge variant={POST_STATUS_VARIANT[post.status]}>
                    {POST_STATUS_LABEL[post.status]}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-semibold">이 회원이 보낸 문의 {user.inquiries.length}건</h2>
      {user.inquiries.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">보낸 문의가 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {user.inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/admin/inquiries/${inquiry.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
                <div>
                  <p className="font-medium">{inquiry.post.title}</p>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>
                  {INQUIRY_STATUS_LABEL[inquiry.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
