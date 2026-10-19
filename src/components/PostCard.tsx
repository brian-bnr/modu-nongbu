import Link from "next/link";
import type { Post, User } from "@prisma/client";
import { Badge } from "@/components/Badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import {
  formatPrice,
  POST_STATUS_LABEL,
  POST_STATUS_VARIANT,
  POST_TYPE_ICON,
  POST_TYPE_LABEL,
} from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);

export function PostCard({
  post,
  isFavorited,
}: {
  post: Post & { author: User };
  /** 전달하면(true/false) 찜 버튼이 카드 위에 겹쳐 보인다. 생략하면 버튼 자체가 렌더링되지 않는다. */
  isFavorited?: boolean;
}) {
  const basePath = JOB_TYPES.has(post.postType) ? "/jobs" : "/products";
  const href = `${basePath}/${post.id}`;

  return (
    <div className="relative">
      <Link
        href={href}
        className="flex gap-3 border-b border-black/5 py-3 transition hover:bg-black/[0.02] sm:block sm:overflow-hidden sm:rounded-2xl sm:border sm:border-black/5 sm:bg-white sm:py-0 sm:shadow-sm sm:hover:-translate-y-0.5 sm:hover:border-transparent sm:hover:bg-transparent sm:hover:shadow-md dark:border-white/10 dark:sm:bg-white/5"
      >
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-brand-50 sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none dark:bg-brand-900/30">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl sm:text-4xl">
              {POST_TYPE_ICON[post.postType]}
            </div>
          )}
        </div>
        <div className="flex-1 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-black/50 dark:text-white/50">
                {post.author.name} · {POST_TYPE_LABEL[post.postType]}
                {post.category ? ` · ${post.category}` : ""}
              </p>
              <h3 className="mt-1 line-clamp-2 min-h-12 break-keep text-base font-semibold leading-6 sm:min-h-14 sm:text-lg sm:leading-7">
                {post.title}
              </h3>
            </div>
            <Badge variant={POST_STATUS_VARIANT[post.status]}>
              {POST_STATUS_LABEL[post.status]}
            </Badge>
          </div>
          {/* 가격이 없는 글도 같은 줄 높이를 차지하게 해서, 한 줄에 놓인 카드들의 높이가 항상 통일되게 한다. */}
          <p className="mt-1 min-h-6 text-base font-semibold text-brand-700 sm:mt-2 dark:text-brand-400">
            {post.price != null && (
              <>
                {formatPrice(post.price)}
                {post.unit && (
                  <span className="ml-1 text-xs font-normal text-black/50 dark:text-white/50">
                    / {post.unit}
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </Link>
      {isFavorited !== undefined && (
        // 모바일(가로 리스트형)에서는 80x80 썸네일 모서리에, sm 이상(세로 카드형)에서는
        // 전체 폭 사진의 우상단 모서리에 오도록 좌표를 breakpoint별로 다르게 둔다.
        <div className="absolute left-14 top-1 sm:left-auto sm:right-3 sm:top-3">
          <FavoriteButton postId={post.id} isFavorited={isFavorited} redirectTo={href} size="sm" />
        </div>
      )}
    </div>
  );
}
