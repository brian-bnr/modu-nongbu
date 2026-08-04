"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema, changePasswordSchema } from "@/lib/validation";

async function requireUserSession() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/profile");
  }
  return session;
}

export type ProfileUpdateActionState = {
  errors?: Record<string, string[] | undefined>;
};

export async function updateProfileAction(
  _prevState: ProfileUpdateActionState,
  formData: FormData
): Promise<ProfileUpdateActionState> {
  const session = await requireUserSession();

  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone },
  });

  redirect("/my/profile");
}

export type ChangePasswordActionState = {
  errors?: Record<string, string[] | undefined>;
};

export async function changePasswordAction(
  _prevState: ChangePasswordActionState,
  formData: FormData
): Promise<ChangePasswordActionState> {
  const session = await requireUserSession();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    newPasswordConfirm: formData.get("newPasswordConfirm"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) {
    return { errors: { currentPassword: ["비밀번호 변경이 불가능한 계정입니다."] } };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { errors: { currentPassword: ["현재 비밀번호가 올바르지 않습니다."] } };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 10) },
  });

  redirect("/my/profile");
}

export type WithdrawActionState = {
  error?: string;
};

export async function withdrawAccountAction(
  _prevState: WithdrawActionState,
  formData: FormData
): Promise<WithdrawActionState> {
  const session = await requireUserSession();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/my/profile");
  }

  if (user.passwordHash) {
    const password = formData.get("password");
    if (typeof password !== "string" || !password) {
      return { error: "비밀번호를 입력해주세요." };
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { error: "비밀번호가 올바르지 않습니다." };
    }
  }

  try {
    await prisma.user.delete({ where: { id: session.user.id } });
  } catch {
    return {
      error: "진행 중인 드론 예약·정산 내역이 있어 탈퇴할 수 없습니다. 고객센터로 문의해주세요.",
    };
  }

  await signOut({ redirectTo: "/" });
  return {};
}
