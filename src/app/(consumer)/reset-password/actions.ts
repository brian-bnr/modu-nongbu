"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";

export type ResetPasswordActionState = {
  errors?: Record<string, string[] | undefined>;
  error?: string;
};

export async function resetPasswordAction(
  _prevState: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    newPasswordConfirm: formData.get("newPasswordConfirm"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const hashedToken = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
  const user = await prisma.user.findUnique({ where: { resetToken: hashedToken } });

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return { error: "재설정 링크가 유효하지 않거나 만료되었습니다. 다시 요청해주세요." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(parsed.data.newPassword, 10),
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  redirect("/login?reset=success");
}
