import { prisma } from "@/lib/prisma";
import { FarmCard } from "@/components/FarmCard";

export default async function FarmsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string }>;
}) {
  const { q, region } = await searchParams;

  const [farms, regions] = await Promise.all([
    prisma.farm.findMany({
      where: {
        AND: [
          q ? { name: { contains: q } } : {},
          region ? { region } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.farm.findMany({
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">농가 찾기</h1>

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="농가 이름 검색"
          className="w-56 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
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

      {farms.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">
          조건에 맞는 농가가 없습니다.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      )}
    </div>
  );
}
