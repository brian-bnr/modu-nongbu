"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

export type SignupActionState = {
  errors?: Record<string, string[] | undefined>;
};

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
    region: formData.get("region"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { errors: { email: ["이미 가입된 이메일입니다."] } };
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      region: parsed.data.region || null,
    },
  });

  try {
    await signIn("user", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: { email: ["가입은 완료됐지만 로그인에 실패했습니다. 다시 로그인해주세요."] },
      };
    }
    throw error;
  }

  return {};
}
