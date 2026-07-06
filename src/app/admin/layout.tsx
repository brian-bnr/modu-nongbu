import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/farms", label: "농가 관리" },
  { href: "/admin/products", label: "농산물 관리" },
  { href: "/admin/orders", label: "구매요청 관리" },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return <div className="mx-auto max-w-md px-4 py-16">{children}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
        <div className="flex items-center gap-6">
          <span className="font-bold text-green-700 dark:text-green-400">모두의농부 관리자</span>
          <nav className="flex gap-4 text-sm">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button type="submit" className="text-sm text-black/60 hover:underline dark:text-white/60">
            로그아웃 ({session.user?.email})
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
