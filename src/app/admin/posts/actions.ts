"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function setPostStatus(id: string, status: "OPEN" | "CLOSED") {
  await prisma.post.update({ where: { id }, data: { status } });
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  redirect(`/admin/posts/${id}`);
}

export async function deletePostAdmin(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
