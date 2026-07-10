import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyPage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/my");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">마이페이지</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-black/60 hover:underline dark:text-white/60"
          >
            로그아웃
          </button>
        </form>
      </div>

      <div className="mt-4 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <p className="font-medium">{user.name}</p>
        <p className="mt-1 text-black/60 dark:text-white/60">
          {user.email}
          {user.phone ? ` · ${user.phone}` : ""}
        </p>
        {user.region && <p className="mt-1 text-black/60 dark:text-white/60">{user.region}</p>}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/my/posts"
          className="rounded-lg border border-black/10 p-4 transition hover:border-brand-600 dark:border-white/10"
        >
          <p className="font-medium">내가 올린 글</p>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            판매·구매·구인·구직 글 관리
          </p>
        </Link>
        <Link
          href="/my/inquiries"
          className="rounded-lg border border-black/10 p-4 transition hover:border-brand-600 dark:border-white/10"
        >
          <p className="font-medium">내 문의내역</p>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">내가 보낸 문의·지원 확인</p>
        </Link>
      </div>
    </div>
  );
}
