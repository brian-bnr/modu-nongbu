import Link from "next/link";
import type { Post, User } from "@prisma/client";
import { Badge } from "@/components/Badge";
import {
  formatPrice,
  POST_STATUS_LABEL,
  POST_STATUS_VARIANT,
  POST_TYPE_ICON,
  POST_TYPE_LABEL,
} from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);

export function PostCard({ post }: { post: Post & { author: User } }) {
  const basePath = JOB_TYPES.has(post.postType) ? "/jobs" : "/products";

  return (
    <Link
      href={`${basePath}/${post.id}`}
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
            <h3 className="mt-1 text-base font-semibold sm:text-lg">{post.title}</h3>
          </div>
          <Badge variant={POST_STATUS_VARIANT[post.status]}>{POST_STATUS_LABEL[post.status]}</Badge>
        </div>
        {post.price != null && (
          <p className="mt-1 text-base font-semibold text-brand-700 sm:mt-2 dark:text-brand-400">
            {formatPrice(post.price)}
            {post.unit && (
              <span className="ml-1 text-xs font-normal text-black/50 dark:text-white/50">
                / {post.unit}
              </span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
