"use server";

import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
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

  redirect("/");
}
