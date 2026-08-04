import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/NavIcons";
import { PROVIDER_LABEL } from "@/lib/format";

export default async function MyProfilePage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/profile");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/my/profile");
  }

  const isCredentialsUser = user.provider === "credentials";

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-4 sm:px-8">
      <div className="flex items-center gap-2 py-2">
        <Link
          href="/my"
          aria-label="뒤로"
          className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-semibold">내 정보 관리</h1>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-bold">회원 정보</h2>
        <div className="mt-3 divide-y divide-black/5 rounded-xl border border-black/5 dark:divide-white/10 dark:border-white/10">
          <Link href="/my/profile/edit" className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-black/60 dark:text-white/60">이름</span>
            <span className="flex items-center gap-1 text-sm font-medium">
              {user.name}
              <ChevronRightIcon className="h-4 w-4 text-black/30" />
            </span>
          </Link>
          <Link href="/my/profile/edit" className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-black/60 dark:text-white/60">휴대폰 번호</span>
            <span className="flex items-center gap-1 text-sm font-medium">
              {user.phone || "등록되지 않음"}
              <ChevronRightIcon className="h-4 w-4 text-black/30" />
            </span>
          </Link>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-black/60 dark:text-white/60">이메일</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold">계정 관리</h2>
        <div className="mt-3 divide-y divide-black/5 rounded-xl border border-black/5 dark:divide-white/10 dark:border-white/10">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-black/60 dark:text-white/60">로그인 방식</span>
            <span className="text-sm font-medium">
              {PROVIDER_LABEL[user.provider] ?? user.provider}
            </span>
          </div>
          {isCredentialsUser && (
            <Link
              href="/my/profile/password"
              className="flex items-center justify-between px-4 py-3.5"
            >
              <span className="text-sm font-medium">비밀번호 변경</span>
              <ChevronRightIcon className="h-4 w-4 text-black/30" />
            </Link>
          )}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm font-medium">로그아웃</span>
              <ChevronRightIcon className="h-4 w-4 text-black/30" />
            </button>
          </form>
          <Link
            href="/my/profile/withdraw"
            className="flex items-center justify-between px-4 py-3.5"
          >
            <span className="text-sm font-medium text-black/60 dark:text-white/50">회원 탈퇴</span>
            <ChevronRightIcon className="h-4 w-4 text-black/30" />
          </Link>
        </div>
      </section>
    </div>
  );
}
