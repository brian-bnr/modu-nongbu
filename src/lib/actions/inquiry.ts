"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { inquirySchema } from "@/lib/validation";

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
      message: parsed.data.message || null,
      quantity: parsed.data.quantity ?? null,
    },
  });

  revalidatePath(`/products/${post.id}`);
  revalidatePath(`/jobs/${post.id}`);
  revalidatePath("/my/inquiries");

  return { status: "success", inquiryId: inquiry.id };
}
