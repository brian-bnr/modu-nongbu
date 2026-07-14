import Link from "next/link";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { ScrollReveal } from "@/components/ScrollReveal";

export const TILE_STYLES = {
  purple: { header: "bg-gradient-to-br from-purple-600 to-purple-800", icon: "👀" },
  amber: { header: "bg-gradient-to-br from-amber-500 to-amber-700", icon: "💬" },
  blue: { header: "bg-gradient-to-br from-blue-600 to-blue-800", icon: "👥" },
  green: { header: "bg-gradient-to-br from-brand-500 to-brand-700", icon: "📝" },
  teal: { header: "bg-gradient-to-br from-teal-500 to-teal-700", icon: "🚁" },
  accent: { header: "bg-gradient-to-br from-accent-500 to-accent-700", icon: "💰" },
  indigo: { header: "bg-gradient-to-br from-indigo-600 to-indigo-800", icon: "🔒" },
  emerald: { header: "bg-gradient-to-br from-emerald-500 to-emerald-700", icon: "✅" },
} as const;

export type TileColor = keyof typeof TILE_STYLES;

const SECTION_TONES = {
  brand: "bg-gradient-to-r from-brand-700 to-brand-800",
  amber: "bg-gradient-to-r from-amber-600 to-amber-800",
  blue: "bg-gradient-to-r from-blue-600 to-blue-800",
  teal: "bg-gradient-to-r from-teal-600 to-teal-800",
  accent: "bg-gradient-to-r from-accent-600 to-accent-700",
  indigo: "bg-gradient-to-r from-indigo-600 to-indigo-800",
  purple: "bg-gradient-to-r from-purple-600 to-purple-800",
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
    <div className="group h-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
      <div
        className={`flex items-center justify-between px-3 py-2 text-xs font-medium text-white sm:text-sm ${style.header}`}
      >
        <span>{label}</span>
        <span className="text-sm opacity-90 transition-transform duration-300 group-hover:scale-125">
          {icon ?? style.icon}
        </span>
      </div>
      <div className="px-3 py-4 text-center text-2xl font-bold sm:py-6 sm:text-4xl">
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
      className={`rounded-t-lg px-4 py-2.5 text-center text-sm font-semibold text-white ${SECTION_TONES[tone]}`}
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
        className="flex h-full flex-col justify-between gap-2 rounded-lg border border-black/10 bg-white p-3 text-sm shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-600 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
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
