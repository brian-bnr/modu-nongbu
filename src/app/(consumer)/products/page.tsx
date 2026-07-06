import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; region?: string }>;
}) {
  const { q, category, region } = await searchParams;

  const [products, categories, regions] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          q ? { name: { contains: q } } : {},
          category ? { category } : {},
          region ? { farm: { region } } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { farm: true },
    }),
    prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
    prisma.farm.findMany({
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">농산물</h1>

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="농산물 이름 검색"
          className="w-56 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          <option value="">전체 카테고리</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
        <select
          name="region"
          defaultValue={region ?? ""}
          className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          <option value="">전체 지역</option>
          {regions.map((r) => (
            <option key={r.region} value={r.region}>
              {r.region}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          검색
        </button>
      </form>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">
          조건에 맞는 농산물이 없습니다.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
