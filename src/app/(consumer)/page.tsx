import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FarmCard } from "@/components/FarmCard";
import { ProductCard } from "@/components/ProductCard";

const FEATURES = [
  { icon: "📍", label: "전국 농가 연결", desc: "지역별 농가와 소비자를 바로 연결해드려요" },
  { icon: "🤝", label: "믿을 수 있는 직거래", desc: "중간 유통 없이 농민과 직접 거래해요" },
  { icon: "💬", label: "간편한 문의·구매요청", desc: "궁금한 점은 문의하고, 마음에 들면 요청 한 번으로" },
];

const HOW_IT_WORKS = [
  { step: "1", icon: "🔍", title: "농가·농산물 둘러보기", desc: "지역, 카테고리로 원하는 농산물을 찾아보세요" },
  { step: "2", icon: "💬", title: "문의 또는 구매요청", desc: "농가에 바로 문의하거나 구매요청을 남겨보세요" },
  { step: "3", icon: "✅", title: "운영자 확인 후 연결", desc: "운영자가 확인하고 농가와 연결해 안내드려요" },
];

const CATEGORY_ICONS: Record<string, string> = {
  과일: "🍎",
  채소: "🥬",
  곡물: "🌾",
  쌀: "🍚",
  열매: "🫐",
  수산물: "🐟",
  축산물: "🥩",
  육류: "🥩",
};

export default async function HomePage() {
  const [farms, products, categories] = await Promise.all([
    prisma.farm.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      take: 6,
      where: { stockStatus: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      include: { farm: true },
    }),
    prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ]);

  return (
    <div>
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-accent-50 via-brand-50 to-brand-100 dark:from-brand-900/50 dark:via-brand-900/30 dark:to-accent-900/20">
        <div className="grid gap-8 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:items-center">
          <div className="max-w-md sm:pl-6 lg:ml-auto lg:max-w-sm lg:pl-0 xl:max-w-md">
            <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
              전국 농가와 소비자를 잇습니다
            </span>
            <h1 className="mt-4 text-3xl font-bold text-brand-900 sm:text-4xl dark:text-brand-50">
              신선한 농산물을
              <br />
              농민에게 직접 받아보세요
            </h1>
            <p className="mt-3 max-w-md text-brand-900/70 dark:text-brand-100/80">
              지역별 농가를 찾아보고, 궁금한 점은 바로 문의하고, 마음에 들면 구매요청까지 한
              곳에서 끝내세요.
            </p>

            <form action="/products" className="mt-6 flex max-w-md gap-2">
              <input
                type="text"
                name="q"
                placeholder="농산물 이름으로 검색 (예: 배, 상추)"
                className="flex-1 rounded-full border-0 bg-white px-4 py-2.5 text-black shadow-sm placeholder:text-black/40"
              />
              <button
                type="submit"
                className="rounded-full bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
              >
                검색
              </button>
            </form>

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.label}>
                  <dt className="text-2xl">{feature.icon}</dt>
                  <dd className="mt-1 text-sm font-medium text-brand-900 dark:text-brand-50">
                    {feature.label}
                  </dd>
                  <dd className="mt-0.5 text-xs text-brand-900/60 dark:text-brand-100/60">
                    {feature.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="aspect-[16/9] max-w-xl overflow-hidden rounded-2xl shadow-lg lg:mx-auto lg:aspect-[4/3] lg:max-w-md">
            <img
              src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=1200&q=80"
              alt="싱싱한 채소들"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        {categories.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold">카테고리로 둘러보기</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              <Link
                href="/products"
                className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
              >
                <span className="text-2xl">🧺</span>
                <span className="text-sm font-medium">전체</span>
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.category}
                  href={`/products?category=${encodeURIComponent(c.category)}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                >
                  <span className="text-2xl">{CATEGORY_ICONS[c.category] ?? "🌱"}</span>
                  <span className="text-sm font-medium">{c.category}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">최근 등록된 농가</h2>
            <Link href="/farms" className="text-sm text-brand-700 hover:underline dark:text-brand-400">
              농가 전체 보기 →
            </Link>
          </div>
          {farms.length === 0 ? (
            <p className="mt-4 text-sm text-black/50 dark:text-white/50">
              아직 등록된 농가가 없습니다.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {farms.map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12 rounded-3xl bg-brand-50 px-6 py-10 sm:px-10 dark:bg-brand-900/20">
          <h2 className="text-center text-xl font-semibold">이렇게 이용해보세요</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm dark:bg-white/10">
                  {item.icon}
                </div>
                <p className="mt-3 text-xs font-semibold text-brand-600 dark:text-brand-400">
                  STEP {item.step}
                </p>
                <p className="mt-1 font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">지금 구매 가능한 농산물</h2>
            <Link
              href="/products"
              className="text-sm text-brand-700 hover:underline dark:text-brand-400"
            >
              농산물 전체 보기 →
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="mt-4 text-sm text-black/50 dark:text-white/50">
              아직 등록된 농산물이 없습니다.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
