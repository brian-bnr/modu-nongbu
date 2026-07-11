import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/posts", label: "게시글 관리" },
  { href: "/admin/inquiries", label: "문의 관리" },
  { href: "/admin/users", label: "회원 관리" },
  { href: "/admin/drones", label: "드론 예약 관리" },
  { href: "/admin/settlements", label: "정산 관리" },
  { href: "/admin/settings", label: "설정" },
];

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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 border-b border-black/10 pb-4 dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="whitespace-nowrap text-sm text-black/60 hover:underline dark:text-white/60"
              >
                로그아웃 <span className="hidden sm:inline">({session.user?.email})</span>
              </button>
            </form>
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
