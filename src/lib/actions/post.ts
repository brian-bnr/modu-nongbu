"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { postSchema } from "@/lib/validation";
import type { PostActionState } from "@/components/PostForm";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);

function basePathFor(postType: string) {
  return JOB_TYPES.has(postType) ? "/jobs" : "/products";
}

function parsePostForm(formData: FormData) {
  return postSchema.safeParse({
    postType: formData.get("postType"),
    title: formData.get("title"),
    category: formData.get("category"),
    price: formData.get("price"),
    unit: formData.get("unit"),
    region: formData.get("region"),
    regionDetail: formData.get("regionDetail"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    status: formData.get("status") || undefined,
  });
}

export async function createPost(
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    return { errors: { title: ["로그인이 필요합니다."] } };
  }

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      postType: parsed.data.postType,
      title: parsed.data.title,
      category: parsed.data.category || null,
      price: parsed.data.price ?? null,
      unit: parsed.data.unit || null,
      region: parsed.data.region,
      regionDetail: parsed.data.regionDetail || null,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  const base = basePathFor(post.postType);
  revalidatePath(base);
  revalidatePath("/");
  redirect(`${base}/${post.id}`);
}

export async function updatePost(
  id: string,
  _prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    return { errors: { title: ["로그인이 필요합니다."] } };
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== session.user.id) {
    return { errors: { title: ["수정 권한이 없습니다."] } };
  }

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      postType: parsed.data.postType,
      title: parsed.data.title,
      category: parsed.data.category || null,
      price: parsed.data.price ?? null,
      unit: parsed.data.unit || null,
      region: parsed.data.region,
      regionDetail: parsed.data.regionDetail || null,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl || null,
      status: parsed.data.status ?? existing.status,
    },
  });

  const base = basePathFor(post.postType);
  revalidatePath(base);
  revalidatePath(`${base}/${id}`);
  revalidatePath("/my/posts");
  revalidatePath("/");
  redirect(`${base}/${id}`);
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login");
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== session.user.id) {
    redirect("/my/posts");
  }

  const base = basePathFor(existing.postType);
  await prisma.post.delete({ where: { id } });

  revalidatePath(base);
  revalidatePath("/my/posts");
  revalidatePath("/");
  redirect("/my/posts");
}
