"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { inquirySchema, inquiryUpdateSchema } from "@/lib/validation";
import { filterProfanity } from "@/lib/profanity";

export type InquiryActionState = {
  status: "idle" | "error" | "success";
  errors?: Record<string, string[] | undefined>;
  inquiryId?: string;
};

export async function createInquiry(
  _prevState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return { status: "error", errors: { postId: ["로그인이 필요합니다."] } };
  }

  const parsed = inquirySchema.safeParse({
    postId: formData.get("postId"),
    message: formData.get("message"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors };
  }

  const post = await prisma.post.findUnique({ where: { id: parsed.data.postId } });
  if (!post) {
    return { status: "error", errors: { postId: ["게시글을 찾을 수 없습니다."] } };
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      postId: post.id,
      userId: session.user.id,
      message: parsed.data.message ? filterProfanity(parsed.data.message) : null,
      quantity: parsed.data.quantity ?? null,
    },
  });

  revalidatePath(`/products/${post.id}`);
  revalidatePath(`/jobs/${post.id}`);
  revalidatePath("/my/inquiries");

  return { status: "success", inquiryId: inquiry.id };
}

export async function updateInquiry(
  id: string,
  _prevState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return { status: "error", errors: { message: ["로그인이 필요합니다."] } };
  }

  const existing = await prisma.inquiry.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return { status: "error", errors: { message: ["수정 권한이 없습니다."] } };
  }
  if (existing.status !== "REQUESTED") {
    return { status: "error", errors: { message: ["이미 처리가 진행되어 수정할 수 없습니다."] } };
  }

  const parsed = inquiryUpdateSchema.safeParse({
    message: formData.get("message"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return { status: "error", errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.inquiry.update({
    where: { id },
    data: {
      message: parsed.data.message ? filterProfanity(parsed.data.message) : null,
      quantity: parsed.data.quantity ?? null,
    },
  });

  revalidatePath(`/products/${existing.postId}`);
  revalidatePath(`/jobs/${existing.postId}`);
  revalidatePath("/my/inquiries");
  redirect("/my/inquiries");
}
