"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendPasswordResetEmail } from "@/lib/email";

export type ForgotPasswordActionState = {
  error?: string;
  success?: boolean;
};

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export async function forgotPasswordAction(
  _prevState: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "올바른 이메일을 입력해주세요." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // 가입 여부와 무관하게 항상 동일한 성공 응답을 반환한다 — 이메일 존재 여부가 노출되지 않도록.
  if (user && user.passwordHash) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return { success: true };
}
