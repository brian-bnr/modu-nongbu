import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WithdrawAccountForm } from "@/components/WithdrawAccountForm";
import { withdrawAccountAction } from "../actions";

export default async function WithdrawAccountPage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/profile/withdraw");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/my/profile/withdraw");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">회원 탈퇴</h1>
      <p className="mt-2 text-sm text-black/50 dark:text-white/50">
        탈퇴 시 작성한 글, 문의 내역 등 모든 정보가 삭제되며 복구할 수 없습니다.
      </p>
      <div className="mt-6">
        <WithdrawAccountForm action={withdrawAccountAction} requirePassword={!!user.passwordHash} />
      </div>
    </div>
  );
}
