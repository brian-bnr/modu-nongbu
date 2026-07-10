import Link from "next/link";
import { notFound } from "next/navigation";
import type { PostType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/Badge";
import { InquiryForm } from "@/components/InquiryForm";
import { PostImageLightbox } from "@/components/PostImageLightbox";
import {
  formatDate,
  formatPrice,
  POST_STATUS_LABEL,
  POST_STATUS_VARIANT,
  POST_TYPE_ICON,
  POST_TYPE_LABEL,
} from "@/lib/format";

export async function PostDetail({
  id,
  allowedTypes,
  basePath,
}: {
  id: string;
  allowedTypes: PostType[];
  basePath: string;
}) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post || !allowedTypes.includes(post.postType)) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.type === "user" && session.user.id === post.authorId;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {post.imageUrl ? (
            <PostImageLightbox src={post.imageUrl} alt={post.title} />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-brand-50 text-6xl dark:bg-brand-900/30">
              {POST_TYPE_ICON[post.postType]}
            </div>
          )}

          <p className="mt-5 text-sm text-black/50 dark:text-white/50">
            {post.author.name} · {POST_TYPE_LABEL[post.postType]}
            {post.category ? ` · ${post.category}` : ""}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <Badge variant={POST_STATUS_VARIANT[post.status]}>
              {POST_STATUS_LABEL[post.status]}
            </Badge>
          </div>
          {post.price != null && (
            <p className="mt-3 text-xl font-semibold text-brand-700 dark:text-brand-400">
              {formatPrice(post.price)}
              {post.unit && (
                <span className="ml-1 text-sm font-normal text-black/50 dark:text-white/50">
                  / {post.unit}
                </span>
              )}
            </p>
          )}
          {post.description && (
            <p className="mt-4 whitespace-pre-line text-black/70 dark:text-white/70">
              {post.description}
            </p>
          )}

          <div className="mt-6 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
            <p className="font-medium">작성자 정보</p>
            <p className="mt-2 text-black/70 dark:text-white/70">
              {post.author.name} · {post.region}
              {post.regionDetail ? ` ${post.regionDetail}` : ""}
            </p>
            <p className="mt-1 text-black/40 dark:text-white/40">
              {formatDate(post.createdAt)} 등록
            </p>
          </div>

          {isOwner && (
            <div className="mt-4 flex gap-3 text-sm">
              <Link
                href={`${basePath}/${post.id}/edit`}
                className="text-brand-700 hover:underline dark:text-brand-400"
              >
                내 글 수정하기
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-lg border border-black/10 p-5 dark:border-white/10">
            <h2 className="text-lg font-semibold">문의하기</h2>
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">
              문의를 보내면 로그인 계정의 연락처가 작성자에게 전달됩니다.
            </p>
            <div className="mt-4">
              {isOwner ? (
                <p className="rounded-md bg-black/5 px-3 py-2 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
                  내가 등록한 글입니다.
                </p>
              ) : post.status === "CLOSED" ? (
                <p className="rounded-md bg-black/5 px-3 py-2 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
                  마감된 글입니다.
                </p>
              ) : session?.user?.type === "user" ? (
                <InquiryForm postId={post.id} postType={post.postType} />
              ) : (
                <Link
                  href={`/login?callbackUrl=${basePath}/${post.id}`}
                  className="block rounded-md bg-brand-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-800"
                >
                  로그인하고 문의하기
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
