import Link from "next/link";
import type { Farm } from "@prisma/client";

export function FarmCard({ farm }: { farm: Farm & { _count?: { products: number } } }) {
  return (
    <Link
      href={`/farms/${farm.id}`}
      className="block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-brand-50 dark:bg-brand-900/30">
        {farm.imageUrl ? (
          <img src={farm.imageUrl} alt={farm.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🚜</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-black/50 dark:text-white/50">
          {farm.region}
          {farm.regionDetail ? ` · ${farm.regionDetail}` : ""}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{farm.name}</h3>
        {farm.description && (
          <p className="mt-2 line-clamp-2 text-sm text-black/60 dark:text-white/60">
            {farm.description}
          </p>
        )}
        {farm._count && (
          <p className="mt-3 text-xs text-black/40 dark:text-white/40">
            취급 농산물 {farm._count.products}개
          </p>
        )}
      </div>
    </Link>
  );
}
