import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { PurchaseRequestForm } from "@/components/PurchaseRequestForm";
import { formatPrice, STOCK_STATUS_LABEL, STOCK_STATUS_VARIANT } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { farm: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-50 dark:bg-brand-900/30">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">🥬</div>
            )}
          </div>

          <p className="mt-5 text-sm text-black/50 dark:text-white/50">
            <Link href={`/farms/${product.farm.id}`} className="hover:underline">
              {product.farm.name}
            </Link>{" "}
            · {product.category}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Badge variant={STOCK_STATUS_VARIANT[product.stockStatus]}>
              {STOCK_STATUS_LABEL[product.stockStatus]}
            </Badge>
          </div>
          <p className="mt-3 text-xl font-semibold text-brand-700 dark:text-brand-400">
            {formatPrice(product.price)}
            <span className="ml-1 text-sm font-normal text-black/50 dark:text-white/50">
              / {product.unit}
            </span>
          </p>
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-black/70 dark:text-white/70">
              {product.description}
            </p>
          )}

          <div className="mt-6 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
            <p className="font-medium">농가에 직접 문의하기</p>
            <p className="mt-2 text-black/70 dark:text-white/70">
              {product.farm.name} · 담당자 {product.farm.contactName}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={`tel:${product.farm.contactPhone}`}
                className="text-brand-700 hover:underline dark:text-brand-400"
              >
                📞 {product.farm.contactPhone}
              </a>
              {product.farm.contactEmail && (
                <a
                  href={`mailto:${product.farm.contactEmail}`}
                  className="text-brand-700 hover:underline dark:text-brand-400"
                >
                  ✉️ {product.farm.contactEmail}
                </a>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-black/10 p-5 dark:border-white/10">
            <h2 className="text-lg font-semibold">구매요청 보내기</h2>
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">
              결제 없이 요청만 남기면 운영자가 확인 후 연락드립니다.
            </p>
            <div className="mt-4">
              {product.stockStatus === "SOLD_OUT" ? (
                <p className="rounded-md bg-black/5 px-3 py-2 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
                  현재 품절된 상품입니다.
                </p>
              ) : (
                <PurchaseRequestForm productId={product.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
