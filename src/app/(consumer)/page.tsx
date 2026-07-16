import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { RankingTabs } from "@/components/RankingTabs";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OperatorCard } from "@/components/OperatorCard";
import { CATEGORY_TILES } from "@/lib/categoryTiles";
import { getApprovedOperatorsWithStats, toOperatorCardData } from "@/lib/droneOperatorStats";
import { SAMPLE_OPERATORS } from "@/lib/sampleOperators";
import { formatPrice } from "@/lib/format";
import { RICE_UNIT_PRICE } from "@/lib/cropPricing";
import { TractorFlatIcon, CartIcon, GradCapIcon } from "@/components/icons/CategoryIcons";

const HERO_SLIDES = [
  {
    image: "/hero-drone.png",
    tag: "방제 예약 시작!",
    title: (
      <>
        건강한 농작물,
        <br />
        모두의농부가 함께합니다
      </>
    ),
    subtitle: "드론 방제부터 위탁영농까지 한 번에 해결하세요",
    href: "/drones/new",
    gradient: "from-brand-700 to-brand-900",
  },
  {
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80",
    tag: "농업에 필요한 모든 연결을 한곳에서",
    title: <>모두의농부</>,
    subtitle: "농산물 거래부터 일손 구인까지, 대한민국 농업의 모든 연결이 이어지는 곳입니다",
    href: "/products",
    gradient: "from-accent-600 to-accent-800",
  },
];

const POPULAR_SERVICES_STUBS = [
  { title: "위탁영농", href: "/consign-farming", Icon: TractorFlatIcon, gradient: "from-lime-600 to-lime-800" },
  { title: "농자재 쇼핑", href: "/farm-supplies", Icon: CartIcon, gradient: "from-orange-500 to-orange-700" },
  { title: "농업교육", href: "/education", Icon: GradCapIcon, gradient: "from-rose-500 to-rose-700" },
];

const getHomeData = unstable_cache(
  async (sevenDaysAgoISO: string) => {
    const sevenDaysAgo = new Date(sevenDaysAgoISO);

    const [recentPosts, popularPool, operators] = await Promise.all([
      prisma.post.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { author: true },
      }),
      prisma.post.findMany({
        take: 30,
        where: { status: "OPEN" },
        orderBy: [{ inquiries: { _count: "desc" } }, { createdAt: "desc" }],
        include: { author: true, _count: { select: { inquiries: true } } },
      }),
      getApprovedOperatorsWithStats(),
    ]);

    const popularRealtime = popularPool.slice(0, 8);
    const popularWeekly = popularPool.filter((p) => p.createdAt >= sevenDaysAgo).slice(0, 8);

    const topOperators =
      operators.length > 0 ? operators.slice(0, 4).map(toOperatorCardData) : SAMPLE_OPERATORS;

    return { recentPosts, popularRealtime, popularWeekly, topOperators };
  },
  ["home-page-data"],
  { revalidate: 300 }
);

export default async function HomePage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const { recentPosts, popularRealtime, popularWeekly, topOperators } =
    await getHomeData(sevenDaysAgo.toISOString());

  return (
    <div>
      <HeroCarousel slides={HERO_SLIDES} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <section>
          <div className="grid grid-cols-5 gap-x-2 gap-y-6 sm:grid-cols-5 lg:grid-cols-10">
            {CATEGORY_TILES.map((t, i) => (
              <ScrollReveal key={t.href} delay={i * 40}>
                <Link href={t.href} className="flex flex-col items-center gap-1.5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/[0.04] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:h-16 sm:w-16">
                    <t.Icon className="h-8 w-8 sm:h-9 sm:w-9" />
                  </span>
                  <span className="text-center text-[11px] font-medium leading-tight sm:text-xs">
                    {t.label}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">인기 서비스</h2>
            <Link href="/services" className="text-sm text-brand-700 hover:underline">
              더보기 →
            </Link>
          </div>
          <ScrollReveal>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0">
              <Link
                href="/drones/new"
                className="relative h-20 w-32 shrink-0 snap-start overflow-hidden rounded-xl shadow-sm sm:h-24 sm:w-40"
              >
                <Image
                  src="/hero-drone.png"
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2 text-white">
                  <p className="text-sm font-semibold">드론 방제</p>
                  <p className="text-[11px] opacity-90">
                    평당 {formatPrice(RICE_UNIT_PRICE)}~
                  </p>
                </div>
              </Link>
              {POPULAR_SERVICES_STUBS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className={`relative flex h-20 w-32 shrink-0 snap-start items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-sm sm:h-24 sm:w-40 ${s.gradient}`}
                >
                  <s.Icon className="h-9 w-9 opacity-90 sm:h-10 sm:w-10" />
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-black/40 px-1.5 py-0.5 text-[9px] font-medium text-white">
                    준비중
                  </span>
                  <p className="absolute inset-x-0 bottom-0 p-2 text-sm font-semibold text-white">
                    {s.title}
                  </p>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">추천 방제사</h2>
            <Link href="/drones/operators" className="text-sm text-brand-700 hover:underline">
              더보기 →
            </Link>
          </div>
          {topOperators.length === 0 ? (
            <p className="mt-4 text-sm text-black/50">아직 등록된 방제사가 없어요.</p>
          ) : (
            <ScrollReveal>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {topOperators.map((op) => (
                  <div key={op.id} className="w-64 snap-start sm:w-auto">
                    <OperatorCard operator={op} />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </section>

        {popularRealtime.length > 0 && (
          <ScrollReveal className="mt-12" delay={0}>
            <section>
              <h2 className="text-xl font-semibold">인기 매물</h2>
              <p className="mt-1 text-sm text-black/50">
                문의가 많은 매물을 실시간/주간으로 확인해보세요.
              </p>
              <div className="mt-4">
                <RankingTabs realtime={popularRealtime} weekly={popularWeekly} />
              </div>
            </section>
          </ScrollReveal>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">최근 등록된 글</h2>
            <div className="flex gap-3 text-sm">
              <Link href="/products" className="text-brand-700 hover:underline">
                농산물 →
              </Link>
              <Link href="/jobs" className="text-brand-700 hover:underline">
                일자리 →
              </Link>
            </div>
          </div>
          {recentPosts.length === 0 ? (
            <p className="mt-4 text-sm text-black/50">아직 등록된 글이 없습니다.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-0 sm:grid-cols-4 sm:gap-4">
              {recentPosts.map((post, i) => (
                <ScrollReveal key={post.id} delay={(i % 4) * 80}>
                  <PostCard post={post} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
