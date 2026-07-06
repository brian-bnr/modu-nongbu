import Link from "next/link";
import type { Product, Farm } from "@prisma/client";
import { Badge } from "@/components/Badge";
import { formatPrice, STOCK_STATUS_LABEL, STOCK_STATUS_VARIANT } from "@/lib/format";

export function ProductCard({ product }: { product: Product & { farm: Farm } }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-brand-50 dark:bg-brand-900/30">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🥬</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-black/50 dark:text-white/50">
              {product.farm.name} · {product.category}
            </p>
            <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
          </div>
          <Badge variant={STOCK_STATUS_VARIANT[product.stockStatus]}>
            {STOCK_STATUS_LABEL[product.stockStatus]}
          </Badge>
        </div>
        <p className="mt-2 text-base font-semibold text-brand-700 dark:text-brand-400">
          {formatPrice(product.price)}
          <span className="ml-1 text-xs font-normal text-black/50 dark:text-white/50">
            / {product.unit}
          </span>
        </p>
      </div>
    </Link>
  );
}
