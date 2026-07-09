import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/products", label: "농산물" },
  { href: "/jobs", label: "일자리" },
];

export async function Header() {
  const session = await auth();
  const isUser = session?.user?.type === "user";

  return (
    <header className="border-b border-brand-100 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-brand-700 dark:text-brand-400"
        >
          <Image src="/logo-icon.png" alt="" width={34} height={34} quality={100} />
          모두의농부
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <div className="hidden items-center gap-4 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
          {isUser ? (
            <>
              <Link
                href="/my"
                className="hidden rounded-md border border-black/10 px-3 py-1.5 hover:bg-black/5 sm:block dark:border-white/20 dark:hover:bg-white/10"
              >
                마이페이지
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="hidden text-sm text-black/60 hover:underline sm:block dark:text-white/60"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-black/10 px-3 py-1.5 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              로그인
            </Link>
          )}
          <Link
            href="/admin"
            className="text-xs text-black/40 hover:underline dark:text-white/40"
          >
            운영자
          </Link>
        </nav>
      </div>
    </header>
  );
}
