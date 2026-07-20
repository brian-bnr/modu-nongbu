import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { BellIcon } from "@/components/icons/NavIcons";

export type DashboardAction = {
  label: string;
  sublabel: string;
  href: string;
  iconSrc?: string;
  Icon?: ComponentType<{ className?: string }>;
};

const MODE_BADGE_CLASS: Record<string, string> = {
  green: "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

const HERO_GRADIENT_CLASS: Record<string, string> = {
  green: "bg-gradient-to-br from-brand-600 to-brand-800",
  blue: "bg-gradient-to-br from-blue-600 to-blue-800",
  amber: "bg-gradient-to-br from-amber-500 to-amber-700",
  purple: "bg-gradient-to-br from-purple-600 to-purple-800",
};

export function DashboardShell({
  modeLabel,
  color,
  name,
  heroTitle,
  heroSubtitle,
  heroHref,
  actions,
  children,
}: {
  modeLabel: string;
  color: "green" | "blue" | "amber" | "purple";
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  heroHref: string;
  actions: DashboardAction[];
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${MODE_BADGE_CLASS[color]}`}>
          {modeLabel}
        </span>
        <BellIcon className="h-5 w-5 text-black/30 dark:text-white/30" />
      </div>

      <p className="mt-3 text-sm text-black/60 dark:text-white/60">안녕하세요! {name}님</p>

      <Link
        href={heroHref}
        className={`mt-3 block rounded-xl p-5 text-white transition hover:brightness-110 ${HERO_GRADIENT_CLASS[color]}`}
      >
        <p className="text-base font-bold leading-snug">{heroTitle}</p>
        <p className="mt-1 text-xs text-white/80">{heroSubtitle}</p>
      </Link>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-center gap-1.5 rounded-lg py-1 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            {a.iconSrc ? (
              <Image
                src={a.iconSrc}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : a.Icon ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
                <a.Icon className="h-5 w-5 text-black/60 dark:text-white/60" />
              </span>
            ) : null}
            <span className="text-[11px] font-semibold leading-tight">{a.label}</span>
            <span className="text-[10px] leading-tight text-black/40 dark:text-white/40">
              {a.sublabel}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">{children}</div>
    </div>
  );
}
