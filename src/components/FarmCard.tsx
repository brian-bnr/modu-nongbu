import Link from "next/link";
import type { Farm } from "@prisma/client";

export function FarmCard({ farm }: { farm: Farm & { _count?: { products: number } } }) {
  return (
    <Link
      href={`/farms/${farm.id}`}
      className="flex gap-3 border-b border-black/5 py-3 transition hover:bg-black/[0.02] sm:block sm:overflow-hidden sm:rounded-2xl sm:border sm:border-black/5 sm:bg-white sm:py-0 sm:shadow-sm sm:hover:-translate-y-0.5 sm:hover:border-transparent sm:hover:bg-transparent sm:hover:shadow-md dark:border-white/10 dark:sm:bg-white/5"
    >
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-brand-50 sm:aspect-[16/9] sm:h-auto sm:w-full sm:rounded-none dark:bg-brand-900/30">
        {farm.imageUrl ? (
          <img src={farm.imageUrl} alt={farm.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl sm:text-4xl">🚜</div>
        )}
      </div>
      <div className="flex-1 sm:p-4">
        <p className="text-xs text-black/50 dark:text-white/50">
          {farm.region}
          {farm.regionDetail ? ` · ${farm.regionDetail}` : ""}
        </p>
        <h3 className="mt-1 text-base font-semibold sm:text-lg">{farm.name}</h3>
        {farm.description && (
          <p className="mt-1 line-clamp-2 text-sm text-black/60 sm:mt-2 dark:text-white/60">
            {farm.description}
          </p>
        )}
        {farm._count && (
          <p className="mt-1 text-xs text-black/40 sm:mt-3 dark:text-white/40">
            취급 농산물 {farm._count.products}개
          </p>
        )}
      </div>
    </Link>
  );
}
