import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FarmCard } from "@/components/FarmCard";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const [farms, products] = await Promise.all([
    prisma.farm.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      take: 4,
      where: { stockStatus: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      include: { farm: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="rounded-xl bg-green-700 px-6 py-12 text-white sm:px-10">
        <h1 className="text-2xl font-bold sm:text-3xl">
          전국 농가의 농산물을, 농민에게 직접
        </h1>
        <p className="mt-3 max-w-xl text-green-50">
          지역별 농가를 찾아보고, 상품에 직접 문의하거나 구매요청을 보내보세요.
        </p>
        <form action="/products" className="mt-6 flex max-w-md gap-2">
          <input
            type="text"
            name="q"
            placeholder="농산물 이름으로 검색 (예: 배, 상추)"
            className="flex-1 rounded-md border-0 px-4 py-2 text-black placeholder:text-black/40"
          />
          <button
            type="submit"
            className="rounded-md bg-white px-4 py-2 font-medium text-green-700 hover:bg-green-50"
          >
            검색
          </button>
        </form>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">최근 등록된 농가</h2>
          <Link href="/farms" className="text-sm text-green-700 hover:underline dark:text-green-400">
            농가 전체 보기 →
          </Link>
        </div>
        {farms.length === 0 ? (
          <p className="mt-4 text-sm text-black/50 dark:text-white/50">
            아직 등록된 농가가 없습니다.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">지금 구매 가능한 농산물</h2>
          <Link
            href="/products"
            className="text-sm text-green-700 hover:underline dark:text-green-400"
          >
            농산물 전체 보기 →
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="mt-4 text-sm text-black/50 dark:text-white/50">
            아직 등록된 농산물이 없습니다.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
