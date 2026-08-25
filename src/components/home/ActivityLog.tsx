import Link from "next/link";
import type { Post, User } from "@prisma/client";
import { Badge } from "@/components/Badge";
import {
  POST_TYPE_ICON,
  POST_TYPE_LABEL,
  POST_STATUS_LABEL,
  POST_STATUS_VARIANT,
  formatPrice,
  formatRelativeTime,
} from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);

type PostWithAuthor = Post & { author: User };

function LogRow({ post }: { post: PostWithAuthor }) {
  const basePath = JOB_TYPES.has(post.postType) ? "/jobs" : "/products";

  return (
    <Link
      href={`${basePath}/${post.id}`}
      className="flex items-center gap-3 border-b border-black/10 py-3 transition hover:bg-black/[0.02] sm:gap-4 sm:py-4"
    >
      <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-50 sm:h-[4.5rem] sm:w-[4.5rem]">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xl sm:text-2xl">
            {POST_TYPE_ICON[post.postType]}
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground sm:text-base">
          {post.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-black/45 sm:text-sm">
          {POST_TYPE_LABEL[post.postType]}
          {post.region ? ` · ${post.region}` : ""} · {formatRelativeTime(post.createdAt)}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {post.price != null && (
            <p className="text-sm font-bold text-foreground sm:text-base">
              {formatPrice(post.price)}
            </p>
          )}
          {post.status === "CLOSED" && (
            <Badge variant={POST_STATUS_VARIANT[post.status]}>{POST_STATUS_LABEL[post.status]}</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ActivityLog({ posts }: { posts: PostWithAuthor[] }) {
  if (posts.length === 0) {
    return (
      <p className="border-y border-black/10 py-8 text-center text-sm text-black/50">
        아직 등록된 글이 없어요. 첫 매물을 올려보세요.
      </p>
    );
  }

  return (
    <div className="border-t border-black/10">
      {posts.map((post) => (
        <LogRow key={post.id} post={post} />
      ))}
    </div>
  );
}
