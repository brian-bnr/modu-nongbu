"use server";

import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth, unstable_update } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function switchRoleAction(role: Role) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect("/login?callbackUrl=/");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role },
  });

  // DB만 바꾸면 이미 발급된 JWT의 role은 다음 로그인 전까지 그대로 남아있어
  // 홈 화면이 role을 매번 DB에서 다시 읽어와야 했음(왕복 2회 추가) — 그게
  // 전환 속도가 느리게 느껴진 원인. JWT를 직접 갱신해 그 재조회를 없앤다.
  await unstable_update({ user: { role } });

  redirect("/");
}
