"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function toggleFavoriteAction(postId: string, redirectTo: string) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect(`/login?callbackUrl=${redirectTo}`);
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: session.user.id, postId } });
  }

  revalidatePath(redirectTo);
  revalidatePath("/my/favorites");
}

export async function getFavoritedPostIds(userId: string): Promise<Set<string>> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { postId: true },
  });
  return new Set(favorites.map((f) => f.postId));
}
