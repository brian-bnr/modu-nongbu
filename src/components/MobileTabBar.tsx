"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, GridIcon, SearchIcon, TractorIcon, UserIcon } from "@/components/icons/NavIcons";

const BASE_TABS = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/services", label: "서비스", Icon: GridIcon },
  { href: "/search", label: "검색", Icon: SearchIcon },
  { href: "/drones", label: "내농장", Icon: TractorIcon },
];

export function MobileTabBar({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const tabs = [
    ...BASE_TABS,
    loggedIn
      ? { href: "/my", label: "마이페이지", Icon: UserIcon }
      : { href: "/login", label: "로그인", Icon: UserIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden">
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
              active ? "text-brand-700" : "text-black/50"
            }`}
          >
            <tab.Icon className="h-6 w-6" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
