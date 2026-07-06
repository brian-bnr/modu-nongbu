"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/farms", label: "농가", icon: "🚜" },
  { href: "/products", label: "농산물", icon: "🥬" },
  { href: "/orders/lookup", label: "주문조회", icon: "📦" },
  { href: "/admin", label: "운영자", icon: "👤" },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-white/10 dark:bg-neutral-900">
      {TABS.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
              active
                ? "text-brand-700 dark:text-brand-400"
                : "text-black/50 dark:text-white/50"
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
