import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { changePasswordAction } from "../actions";

export default async function ChangePasswordPage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/profile/password");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/my/profile/password");
  }
  if (!user.passwordHash) {
    redirect("/my/profile");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">비밀번호 변경</h1>
      <div className="mt-6">
        <ChangePasswordForm action={changePasswordAction} />
      </div>
    </div>
  );
}
