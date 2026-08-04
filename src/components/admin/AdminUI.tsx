import Link from "next/link";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { ScrollReveal } from "@/components/ScrollReveal";

export const TILE_STYLES = {
  purple: {
    badge: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    icon: "👀",
  },
  amber: {
    badge: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    icon: "💬",
  },
  blue: {
    badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    icon: "👥",
  },
  green: {
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400",
    icon: "📝",
  },
  teal: {
    badge: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
    icon: "🚁",
  },
  accent: {
    badge: "bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400",
    icon: "💰",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    icon: "🔒",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    icon: "✅",
  },
} as const;

export type TileColor = keyof typeof TILE_STYLES;

const SECTION_TONES = {
  brand: "border-l-brand-600 dark:border-l-brand-400",
  amber: "border-l-amber-500 dark:border-l-amber-400",
  blue: "border-l-blue-500 dark:border-l-blue-400",
  teal: "border-l-teal-500 dark:border-l-teal-400",
  accent: "border-l-accent-600 dark:border-l-accent-400",
  indigo: "border-l-indigo-500 dark:border-l-indigo-400",
  purple: "border-l-purple-500 dark:border-l-purple-400",
} as const;

export type SectionTone = keyof typeof SECTION_TONES;

export function PageIntro({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && (
        <p className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
          </span>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function StatTile({
  label,
  value,
  color,
  href,
  unit,
  icon,
  delay = 0,
}: {
  label: string;
  value: number;
  color: TileColor;
  href?: string;
  unit?: string;
  icon?: string;
  delay?: number;
}) {
  const style = TILE_STYLES[color];
  const body = (
    <div className="group flex h-full flex-col gap-3 rounded-xl border border-black/8 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-black/55 dark:text-white/55">{label}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm transition-transform duration-200 group-hover:scale-110 ${style.badge}`}
        >
          {icon ?? style.icon}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
        <AnimatedNumber value={value} unit={unit} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      {href ? (
        <Link href={href} className="block h-full">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}

export function SectionHeader({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: SectionTone;
}) {
  return (
    <div
      className={`rounded-t-lg border-b border-l-4 border-black/8 bg-black/[0.015] px-4 py-2.5 text-sm font-semibold text-black/80 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/85 ${SECTION_TONES[tone]}`}
    >
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  tone,
  delay = 0,
  children,
}: {
  title: string;
  tone?: SectionTone;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <ScrollReveal delay={delay} className="overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
      <SectionHeader tone={tone}>{title}</SectionHeader>
      <div className="bg-white p-4 dark:bg-white/5">{children}</div>
    </ScrollReveal>
  );
}

export function GridCard({
  href,
  delay = 0,
  children,
}: {
  href: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <li className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <Link
        href={href}
        className="flex h-full flex-col justify-between gap-2 rounded-lg border border-black/10 bg-white p-3 text-sm shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-md dark:border-white/10 dark:bg-white/5"
      >
        {children}
      </Link>
    </li>
  );
}

export function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-700 text-white"
          : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
      }`}
    >
      {children}
    </Link>
  );
}
