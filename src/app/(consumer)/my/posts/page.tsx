import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { DeleteButton } from "@/components/DeleteButton";
import { deletePost } from "@/lib/actions/post";
import { POST_STATUS_LABEL, POST_STATUS_VARIANT, POST_TYPE_LABEL, formatDate } from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);

export default async function MyPostsPage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/posts");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">내가 올린 글</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-black/50 dark:text-white/50">아직 올린 글이 없습니다.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {posts.map((post) => {
            const base = JOB_TYPES.has(post.postType) ? "/jobs" : "/products";
            return (
              <li
                key={post.id}
                className="rounded-lg border border-black/10 p-4 dark:border-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      {POST_TYPE_LABEL[post.postType]} · {formatDate(post.createdAt)}
                    </p>
                    <Link
                      href={`${base}/${post.id}`}
                      className="mt-1 block font-medium hover:underline"
                    >
                      {post.title}
                    </Link>
                  </div>
                  <Badge variant={POST_STATUS_VARIANT[post.status]}>
                    {POST_STATUS_LABEL[post.status]}
                  </Badge>
                </div>
                <div className="mt-3 flex gap-3 text-sm">
                  <Link
                    href={`${base}/${post.id}/edit`}
                    className="text-brand-700 hover:underline dark:text-brand-400"
                  >
                    수정
                  </Link>
                  <form action={deletePost.bind(null, post.id)}>
                    <DeleteButton />
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
