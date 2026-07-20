import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { BellIcon } from "@/components/icons/NavIcons";

export type DashboardAction = {
  label: string;
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

export function DashboardShell({
  modeLabel,
  color,
  name,
  children,
  actions,
}: {
  modeLabel: string;
  color: "green" | "blue" | "amber" | "purple";
  name: string;
  children: React.ReactNode;
  actions: DashboardAction[];
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${MODE_BADGE_CLASS[color]}`}
        >
          {modeLabel}
        </span>
        <BellIcon className="h-5 w-5 text-black/30 dark:text-white/30" />
      </div>

      <h2 className="mt-3 text-lg font-bold">안녕하세요! {name}님</h2>

      {children}

      <div className="mt-5 grid grid-cols-4 gap-2 border-t border-black/10 pt-4 text-center dark:border-white/10">
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
            <span className="text-[11px] font-medium leading-tight text-black/70 dark:text-white/70">
              {a.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
