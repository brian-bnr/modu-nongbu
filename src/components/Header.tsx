import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const NAV_LINKS = [
  { href: "/products", label: "농산물" },
  { href: "/jobs", label: "일자리" },
];

export async function Header() {
  const session = await auth();
  const isUser = session?.user?.type === "user";

  return (
    <header className="border-b border-brand-100 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-8 sm:py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-base font-bold text-brand-700 sm:gap-2 sm:text-2xl dark:text-brand-400"
        >
          <Image
            src="/logo-icon.png"
            alt=""
            width={34}
            height={34}
            quality={100}
            className="h-6 w-6 sm:h-[34px] sm:w-[34px]"
          />
          모두의농부
        </Link>
        <nav className="flex items-center gap-1.5 text-xs sm:gap-4 sm:text-sm">
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
                  className="whitespace-nowrap text-black/60 hover:underline dark:text-white/60"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap rounded-md border border-black/10 px-2 py-1 hover:bg-black/5 sm:px-3 sm:py-1.5 dark:border-white/20 dark:hover:bg-white/10"
            >
              로그인
            </Link>
          )}
          <Link
            href="/admin"
            className="hidden whitespace-nowrap text-black/40 hover:underline sm:inline dark:text-white/40"
          >
            운영자
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
