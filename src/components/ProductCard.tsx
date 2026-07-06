import Link from "next/link";
import type { Product, Farm } from "@prisma/client";
import { Badge } from "@/components/Badge";
import { formatPrice, STOCK_STATUS_LABEL, STOCK_STATUS_VARIANT } from "@/lib/format";

export function ProductCard({ product }: { product: Product & { farm: Farm } }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block rounded-lg border border-black/10 p-4 transition hover:border-green-600 hover:shadow-sm dark:border-white/10"
    >
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
      <p className="mt-2 text-base font-semibold text-green-700 dark:text-green-400">
        {formatPrice(product.price)}
        <span className="ml-1 text-xs font-normal text-black/50 dark:text-white/50">
          / {product.unit}
        </span>
      </p>
    </Link>
  );
}
