import Link from "next/link";
import type { Product, Farm } from "@prisma/client";
import { Badge } from "@/components/Badge";
import { formatPrice, STOCK_STATUS_LABEL, STOCK_STATUS_VARIANT } from "@/lib/format";

export function ProductCard({ product }: { product: Product & { farm: Farm } }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex gap-3 border-b border-black/5 py-3 transition hover:bg-black/[0.02] sm:block sm:overflow-hidden sm:rounded-2xl sm:border sm:border-black/5 sm:bg-white sm:py-0 sm:shadow-sm sm:hover:-translate-y-0.5 sm:hover:border-transparent sm:hover:bg-transparent sm:hover:shadow-md dark:border-white/10 dark:sm:bg-white/5"
    >
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-brand-50 sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none dark:bg-brand-900/30">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl sm:text-4xl">🥬</div>
        )}
      </div>
      <div className="flex-1 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-black/50 dark:text-white/50">
              {product.farm.name} · {product.category}
            </p>
            <h3 className="mt-1 text-base font-semibold sm:text-lg">{product.name}</h3>
          </div>
          <Badge variant={STOCK_STATUS_VARIANT[product.stockStatus]}>
            {STOCK_STATUS_LABEL[product.stockStatus]}
          </Badge>
        </div>
        <p className="mt-1 text-base font-semibold text-brand-700 sm:mt-2 dark:text-brand-400">
          {formatPrice(product.price)}
          <span className="ml-1 text-xs font-normal text-black/50 dark:text-white/50">
            / {product.unit}
          </span>
        </p>
      </div>
    </Link>
  );
}
