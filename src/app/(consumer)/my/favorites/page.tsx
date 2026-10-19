import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

export default async function MyFavoritesPage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/favorites");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { post: { include: { author: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">찜한 글</h1>

      {favorites.length === 0 ? (
        <p className="mt-6 text-sm text-black/50 dark:text-white/50">
          아직 찜한 글이 없어요. 마음에 드는 매물의 하트를 눌러보세요.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {favorites.map((f) => (
            <PostCard key={f.id} post={f.post} isFavorited />
          ))}
        </div>
      )}
    </div>
  );
}
