import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HeaderAuthSlot } from "@/components/HeaderAuthSlot";
import { SearchIcon } from "@/components/icons/NavIcons";
import { getHeaderBarClass } from "@/lib/seasonalTheme";

const NAV_LINKS = [
  { href: "/products", label: "농산물" },
  { href: "/jobs", label: "일자리" },
];

function HeaderAuthFallback() {
  return (
    <Link
      href="/login"
      className="shrink-0 whitespace-nowrap rounded-md border border-white/25 px-2 py-1 hover:bg-white/10 sm:px-3 sm:py-1.5"
    >
      로그인
    </Link>
  );
}

export function Header() {
  return (
    <header className={getHeaderBarClass()}>
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-8 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-base font-bold text-white sm:gap-2 sm:text-2xl"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm sm:h-9 sm:w-9">
              <Image
                src="/logo-icon.png"
                alt=""
                width={34}
                height={34}
                quality={100}
                className="h-full w-full object-contain"
              />
            </span>
            모두의농부
          </Link>
          <nav className="flex min-w-0 items-center gap-1.5 overflow-x-auto text-xs text-white [scrollbar-width:none] sm:gap-4 sm:text-sm [&::-webkit-scrollbar]:hidden">
            <div className="hidden items-center gap-4 sm:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="shrink-0 text-[1.1375rem] font-bold text-white hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Suspense fallback={<HeaderAuthFallback />}>
              <HeaderAuthSlot />
            </Suspense>
            <Link
              href="/admin"
              className="notranslate shrink-0 whitespace-nowrap text-white/40 hover:underline"
            >
              운영자
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <form
            action="/search"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 transition focus-within:bg-white/25"
          >
            <SearchIcon className="h-4 w-4 shrink-0 text-white/70" />
            <input
              type="text"
              name="q"
              placeholder="농산물, 일자리 검색"
              className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
