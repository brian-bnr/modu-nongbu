import Link from "next/link";

const NAV_LINKS = [
  { href: "/farms", label: "농가 찾기" },
  { href: "/products", label: "농산물" },
  { href: "/orders/lookup", label: "주문 조회" },
];

export function Header() {
  return (
    <header className="border-b border-brand-100 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-brand-700 dark:text-brand-400"
        >
          <span aria-hidden>🌱</span>
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
          <Link
            href="/admin"
            className="hidden rounded-md border border-black/10 px-3 py-1.5 hover:bg-black/5 sm:block dark:border-white/20 dark:hover:bg-white/10"
          >
            운영자
          </Link>
        </nav>
      </div>
    </header>
  );
}
