import Link from "next/link";
import { CATEGORY_TILES } from "@/lib/categoryTiles";

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">서비스</h1>
      <p className="mt-1 text-sm text-black/50">모두의농부의 모든 서비스를 한곳에서 확인하세요.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORY_TILES.map((t) => (
          <Link key={t.href} href={t.href} className="flex flex-col items-center gap-2">
            <span
              className={`relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${t.bg}`}
            >
              <t.Icon className="h-9 w-9" />
              {t.comingSoon && (
                <span className="absolute -bottom-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  준비중
                </span>
              )}
            </span>
            <span className="text-center text-sm font-medium">{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
