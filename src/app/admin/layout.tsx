import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

async function adminSignOut() {
  "use server";
  await signOut({ redirectTo: "/admin/login" });
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || session.user.type !== "admin") {
    return <div className="mx-auto max-w-md px-4 py-16">{children}</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-8">
          <Link
            href="/"
            className="mb-6 block whitespace-nowrap text-lg font-bold text-brand-700 hover:underline dark:text-brand-400"
          >
            모두의농부 관리자
          </Link>
          <AdminNav variant="sidebar" />
          <div className="mt-6 space-y-0.5 border-t border-black/10 pt-4 dark:border-white/10">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-sm text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            >
              메인 화면으로
            </Link>
            <form action={adminSignOut}>
              <button
                type="submit"
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
              >
                로그아웃
                <span className="mt-0.5 block truncate text-xs text-black/40 dark:text-white/40">
                  {session.user?.email}
                </span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 lg:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
            <Link
              href="/"
              className="whitespace-nowrap font-bold text-brand-700 hover:underline dark:text-brand-400"
            >
              모두의농부 관리자
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="whitespace-nowrap text-sm text-black/60 hover:underline dark:text-white/60"
              >
                메인 화면으로
              </Link>
              <form action={adminSignOut}>
                <button
                  type="submit"
                  className="whitespace-nowrap text-sm text-black/60 hover:underline dark:text-white/60"
                >
                  로그아웃 <span className="hidden sm:inline">({session.user?.email})</span>
                </button>
              </form>
            </div>
          </div>
          <div className="mt-3">
            <AdminNav />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
