import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { RankingTabs } from "@/components/RankingTabs";
import { HeroCarousel } from "@/components/HeroCarousel";
import { OperatorCard } from "@/components/OperatorCard";
import { CATEGORY_TILES } from "@/lib/categoryTiles";
import { getApprovedOperatorsWithStats } from "@/lib/droneOperatorStats";
import { formatPrice } from "@/lib/format";

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
  },
  {
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=2000&q=80",
    tag: "농업에 필요한 모든 연결을 한곳에서",
    title: <>모두의농부</>,
    subtitle: "농산물 거래부터 일손 구인까지, 대한민국 농업의 모든 연결이 이어지는 곳입니다",
    href: "/products",
  },
];

const POPULAR_SERVICES_STUBS = [
  { title: "위탁영농", href: "/consign-farming" },
  { title: "농자재 쇼핑", href: "/farm-supplies" },
  { title: "농업교육", href: "/education" },
];

export default async function HomePage() {
  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    recentPosts,
    postCount,
    inquiryCount,
    userCount,
    todayVisitorCount,
    popularRealtime,
    popularWeekly,
    platformSetting,
    operators,
  ] = await Promise.all([
    prisma.post.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { author: true },
    }),
    prisma.post.count(),
    prisma.inquiry.count(),
    prisma.user.count(),
    prisma.visit.count({ where: { visitDate: todayStr } }),
    prisma.post.findMany({
      take: 8,
      where: { status: "OPEN" },
      orderBy: [{ inquiries: { _count: "desc" } }, { createdAt: "desc" }],
      include: { author: true, _count: { select: { inquiries: true } } },
    }),
    prisma.post.findMany({
      take: 8,
      where: { status: "OPEN", createdAt: { gte: sevenDaysAgo } },
      orderBy: [{ inquiries: { _count: "desc" } }, { createdAt: "desc" }],
      include: { author: true, _count: { select: { inquiries: true } } },
    }),
    prisma.platformSetting.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
    getApprovedOperatorsWithStats(),
  ]);

  const STATS = [
    { label: "등록된 매물", value: postCount },
    { label: "누적 문의", value: inquiryCount },
    { label: "함께하는 회원", value: userCount },
    { label: "오늘 방문자", value: todayVisitorCount },
  ];

  const topOperators = operators.slice(0, 4);

  return (
    <div>
      <HeroCarousel slides={HERO_SLIDES} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <section>
          <div className="grid grid-cols-5 gap-x-2 gap-y-6 sm:grid-cols-5 lg:grid-cols-10">
            {CATEGORY_TILES.map((t, i) => (
              <ScrollReveal key={t.href} delay={i * 40}>
                <Link href={t.href} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full text-xl text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:h-14 sm:w-14 sm:text-2xl ${t.color}`}
                  >
                    {t.emoji}
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
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0">
              <Link
                href="/drones/new"
                className="relative w-44 shrink-0 snap-start overflow-hidden rounded-2xl shadow-sm sm:w-56"
              >
                <img
                  src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80"
                  alt=""
                  className="h-32 w-full object-cover sm:h-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="font-semibold">드론 방제</p>
                  <p className="text-xs opacity-90">
                    평당 {formatPrice(platformSetting.droneUnitPrice)}~
                  </p>
                </div>
              </Link>
              {POPULAR_SERVICES_STUBS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex w-44 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-4 text-center sm:w-56"
                >
                  <p className="font-semibold text-black/70">{s.title}</p>
                  <span className="rounded-full bg-black/10 px-2 py-0.5 text-[11px] text-black/50">
                    준비중
                  </span>
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

        <section className="relative z-10 mt-12">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-black/5 shadow-lg sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white px-4 py-5 text-center sm:py-6">
                  <p className="text-2xl font-bold text-brand-800 sm:text-3xl">
                    <AnimatedNumber value={s.value} />
                  </p>
                  <p className="mt-1 text-xs text-black/50 sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
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
