"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/posts", label: "게시글 관리", icon: "📝" },
  { href: "/admin/inquiries", label: "문의 관리", icon: "💬" },
  { href: "/admin/users", label: "회원 관리", icon: "👥" },
  { href: "/admin/drones", label: "드론 예약 관리", icon: "🚁" },
  { href: "/admin/settlements", label: "정산 관리", icon: "💰" },
  { href: "/admin/settings", label: "설정", icon: "⚙️" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-3 flex flex-wrap gap-1.5 text-sm">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 transition ${
              active
                ? "bg-brand-700 font-medium text-white"
                : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            <span className="text-xs">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
