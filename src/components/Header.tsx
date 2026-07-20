import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HeaderAuthSlot } from "@/components/HeaderAuthSlot";
import { SearchIcon, ChatIcon } from "@/components/icons/NavIcons";

const NAV_LINKS = [
  { href: "/products", label: "농산물" },
  { href: "/jobs", label: "일자리" },
];

function HeaderAuthFallback() {
  return (
    <>
      <Link
        href="/login"
        className="whitespace-nowrap rounded-md border border-white/25 px-2 py-1 hover:bg-white/10 sm:px-3 sm:py-1.5"
      >
        로그인
      </Link>
      <Link
        href="/login?callbackUrl=/my/inquiries"
        aria-label="문의함"
        className="text-white hover:text-white/70"
      >
        <ChatIcon className="h-5 w-5" />
      </Link>
    </>
  );
}

export function Header() {
  return (
    <header className="bg-brand-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-8 sm:py-4">
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
        <nav className="flex items-center gap-1.5 text-xs text-white sm:gap-4 sm:text-sm">
          <div className="hidden items-center gap-4 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
          <Suspense fallback={<HeaderAuthFallback />}>
            <HeaderAuthSlot />
          </Suspense>
          <Link
            href="/admin"
            className="whitespace-nowrap text-white/40 hover:underline"
          >
            운영자
          </Link>
          <LanguageSwitcher />
          <Link href="/search" aria-label="검색" className="text-white hover:text-white/70">
            <SearchIcon className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
