import Link from "next/link";
import type { Farm } from "@prisma/client";

export function FarmCard({ farm }: { farm: Farm & { _count?: { products: number } } }) {
  return (
    <Link
      href={`/farms/${farm.id}`}
      className="block rounded-lg border border-black/10 p-4 transition hover:border-green-600 hover:shadow-sm dark:border-white/10"
    >
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
    </Link>
  );
}
