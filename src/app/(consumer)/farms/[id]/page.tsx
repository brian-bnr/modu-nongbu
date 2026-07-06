import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const farm = await prisma.farm.findUnique({
    where: { id },
    include: { products: { orderBy: { createdAt: "desc" } } },
  });

  if (!farm) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-black/50 dark:text-white/50">
        {farm.region}
        {farm.regionDetail ? ` · ${farm.regionDetail}` : ""}
      </p>
      <h1 className="mt-1 text-2xl font-bold">{farm.name}</h1>
      {farm.description && (
        <p className="mt-3 max-w-2xl text-black/70 dark:text-white/70">{farm.description}</p>
      )}

      <div className="mt-6 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <p className="font-medium">농가 문의</p>
        <p className="mt-2 text-black/70 dark:text-white/70">담당자: {farm.contactName}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href={`tel:${farm.contactPhone}`} className="text-green-700 hover:underline dark:text-green-400">
            📞 {farm.contactPhone}
          </a>
          {farm.contactEmail && (
            <a
              href={`mailto:${farm.contactEmail}`}
              className="text-green-700 hover:underline dark:text-green-400"
            >
              ✉️ {farm.contactEmail}
            </a>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-xl font-semibold">취급 농산물</h2>
      {farm.products.length === 0 ? (
        <p className="mt-4 text-sm text-black/50 dark:text-white/50">
          등록된 농산물이 없습니다.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {farm.products.map((product) => (
            <ProductCard key={product.id} product={{ ...product, farm }} />
          ))}
        </div>
      )}
    </div>
  );
}
