"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import type { ComponentType } from "react";
import {
  HomeIcon,
  GridIcon,
  SearchIcon,
  UserIcon,
  CalendarIcon,
  WonIcon,
  MessageIcon,
} from "@/components/icons/NavIcons";

type Tab = { href: string; label: string; Icon: ComponentType<{ className?: string }> };

const HOME_TAB: Tab = { href: "/", label: "홈", Icon: HomeIcon };

const ROLE_MIDDLE_TABS: Record<Role, Tab[]> = {
  FARMER: [
    { href: "/drones", label: "신청내역", Icon: CalendarIcon },
    { href: "/my/inquiries", label: "메시지", Icon: MessageIcon },
  ],
  OPERATOR: [
    { href: "/drones/operator", label: "일정", Icon: CalendarIcon },
    { href: "/drones/operator/settlements", label: "수익", Icon: WonIcon },
  ],
  EXPERT: [
    { href: "/my/inquiries", label: "문의", Icon: MessageIcon },
    { href: "/services", label: "서비스", Icon: GridIcon },
  ],
  COMPANY: [
    { href: "/products", label: "거래", Icon: CalendarIcon },
    { href: "/my/inquiries", label: "메시지", Icon: MessageIcon },
  ],
};

const GUEST_MIDDLE_TABS: Tab[] = [
  { href: "/services", label: "서비스", Icon: GridIcon },
  { href: "/search", label: "검색", Icon: SearchIcon },
];

const ROLE_ACTIVE_CLASS: Record<Role, string> = {
  FARMER: "text-brand-700",
  OPERATOR: "text-blue-700",
  EXPERT: "text-amber-700",
  COMPANY: "text-purple-700",
};

export function MobileTabBar({ loggedIn, role }: { loggedIn: boolean; role?: Role }) {
  const pathname = usePathname();
  const middleTabs = loggedIn && role ? ROLE_MIDDLE_TABS[role] : GUEST_MIDDLE_TABS;
  const tabs: Tab[] = [
    HOME_TAB,
    ...middleTabs,
    loggedIn
      ? { href: "/my", label: "마이페이지", Icon: UserIcon }
      : { href: "/login", label: "로그인", Icon: UserIcon },
  ];
  const activeClass = role ? ROLE_ACTIVE_CLASS[role] : "text-brand-700";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden">
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
              active ? activeClass : "text-black/50"
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
