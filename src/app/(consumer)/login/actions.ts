"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginActionState = {
  error?: string;
};

export async function userLoginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  try {
    await signIn("user", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    }
    throw error;
  }
}
