"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_TABS = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/products", label: "농산물", icon: "🥬" },
  { href: "/jobs", label: "일자리", icon: "🧑‍🌾" },
];

export function MobileTabBar({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const tabs = [
    ...BASE_TABS,
    loggedIn
      ? { href: "/my", label: "마이", icon: "👤" }
      : { href: "/login", label: "로그인", icon: "👤" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-white/10 dark:bg-neutral-900">
      {tabs.map((tab) => {
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
