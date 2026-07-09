import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { DeleteButton } from "@/components/DeleteButton";
import { setPostStatus, deletePostAdmin } from "@/app/admin/posts/actions";
import {
  formatDate,
  formatPrice,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_STATUS_LABEL,
  POST_STATUS_VARIANT,
  POST_TYPE_LABEL,
} from "@/lib/format";

export default async function AdminPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      inquiries: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/posts"
        className="text-sm text-brand-700 hover:underline dark:text-brand-400"
      >
        ← 게시글 목록으로
      </Link>
      <div className="mt-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-black/50 dark:text-white/50">{POST_TYPE_LABEL[post.postType]}</p>
          <h1 className="mt-1 text-2xl font-bold">{post.title}</h1>
        </div>
        <Badge variant={POST_STATUS_VARIANT[post.status]}>{POST_STATUS_LABEL[post.status]}</Badge>
      </div>

      <div className="mt-4 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <p>
          작성자: {post.author.name} ({post.author.email} · {post.author.phone})
        </p>
        <p className="mt-1">
          지역: {post.region} {post.regionDetail}
        </p>
        {post.price != null && (
          <p className="mt-1">
            가격: {formatPrice(post.price)} {post.unit && `/ ${post.unit}`}
          </p>
        )}
        {post.description && <p className="mt-2 whitespace-pre-line">{post.description}</p>}
        <p className="mt-2 text-xs text-black/40 dark:text-white/40">
          {formatDate(post.createdAt)} 등록
        </p>
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        {post.status === "OPEN" ? (
          <form action={setPostStatus.bind(null, post.id, "CLOSED")}>
            <button type="submit" className="text-brand-700 hover:underline dark:text-brand-400">
              마감 처리
            </button>
          </form>
        ) : (
          <form action={setPostStatus.bind(null, post.id, "OPEN")}>
            <button type="submit" className="text-brand-700 hover:underline dark:text-brand-400">
              진행중으로 변경
            </button>
          </form>
        )}
        <form action={deletePostAdmin.bind(null, post.id)}>
          <DeleteButton />
        </form>
      </div>

      <h2 className="mt-8 text-lg font-semibold">문의 {post.inquiries.length}건</h2>
      {post.inquiries.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">아직 문의가 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {post.inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/admin/inquiries/${inquiry.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
                <div>
                  <p className="font-medium">{inquiry.user.name}</p>
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
