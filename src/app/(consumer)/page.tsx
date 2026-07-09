import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { ScrollReveal } from "@/components/ScrollReveal";

const ENTRY_CARDS = [
  {
    href: "/products/new?type=SELL_PRODUCT",
    emoji: "🥬",
    title: "농산물을 판매하고 싶어요",
    subtitle: "농민",
    desc: "내가 키운 농산물을 직접 판매해요.",
    classes:
      "bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-100",
  },
  {
    href: "/products/new?type=BUY_PRODUCT",
    emoji: "🛒",
    title: "농산물을 구매하고 싶어요",
    subtitle: "소비자",
    desc: "농민에게 직접 구매해요.",
    classes:
      "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-100",
  },
  {
    href: "/jobs/new?type=FIND_WORKER",
    emoji: "🧑‍🌾",
    title: "일손이 필요해요",
    subtitle: "농가",
    desc: "필요한 일손을 빠르게 구해요.",
    classes:
      "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
  },
  {
    href: "/jobs/new?type=LOOKING_FOR_WORK",
    emoji: "🙋",
    title: "일을 하고 싶어요",
    subtitle: "도시인 · 작업자",
    desc: "근처 농가에서 일자리를 찾아요.",
    classes:
      "bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-100",
  },
];

const SOON_CARDS = [
  { href: "/machines", emoji: "🚜", title: "농기계" },
  { href: "/drones", emoji: "🚁", title: "드론" },
  { href: "/services", emoji: "🛠️", title: "농업서비스" },
  { href: "/info", emoji: "📰", title: "정보" },
];

export default async function HomePage() {
  const recentPosts = await prisma.post.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div>
      <section className="relative w-full overflow-hidden">
        <ScrollReveal className="group relative h-[480px] w-full sm:h-[560px] lg:h-[640px]">
          <img
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=2000&q=80"
            alt="황금빛 저녁, 넓게 펼쳐진 농경지"
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fffaf0] via-[#fffaf0]/60 to-transparent sm:bg-gradient-to-r sm:from-[#fffaf0] sm:via-[#fffaf0]/55 sm:to-transparent" />
          <div className="absolute inset-0 flex items-end sm:items-center">
            <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-8 sm:pb-0">
              <div className="max-w-xl">
                <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
                  농업에 필요한 모든 연결을 한곳에서
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl lg:text-6xl">
                  모두의농부
                </h1>
                <p className="mt-4 text-base text-brand-900/80 sm:text-lg">
                  씨를 뿌리는 손길부터 밥상 위에 오르기까지,
                  <br />
                  대한민국 농업의 모든 연결이 이어지는 곳입니다.
                </p>
                <p className="mt-3 text-sm text-brand-900/60">
                  지금 나는 무엇을 하려는 사람인가요? 아래에서 바로 시작해보세요.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <section>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {ENTRY_CARDS.map((card, i) => (
              <ScrollReveal key={card.href} delay={i * 80}>
                <Link
                  href={card.href}
                  className={`flex h-full flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-8 text-center transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:px-5 sm:py-10 ${card.classes}`}
                >
                  <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                  <span className="whitespace-nowrap text-[11px] font-semibold sm:text-base">
                    {card.title}
                  </span>
                  <span className="text-xs opacity-70">{card.subtitle}</span>
                  <p className="mt-1 hidden text-xs leading-snug opacity-60 sm:block">
                    {card.desc}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <ScrollReveal
          className="mt-12 rounded-3xl bg-black/[0.02] px-6 py-8 sm:px-10 dark:bg-white/5"
          delay={0}
        >
          <section>
            <h2 className="text-xl font-semibold">곧 만나요</h2>
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">
              농기계·드론·농업서비스·정보 공유까지, 모두의농부가 준비하고 있어요.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SOON_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-black/10 bg-white/60 p-5 text-center text-black/50 transition duration-200 hover:border-black/20 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10"
                >
                  <span className="text-3xl">{card.emoji}</span>
                  <span className="text-sm font-medium">{card.title}</span>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">최근 등록된 글</h2>
            <div className="flex gap-3 text-sm">
              <Link href="/products" className="text-brand-700 hover:underline dark:text-brand-400">
                농산물 →
              </Link>
              <Link href="/jobs" className="text-brand-700 hover:underline dark:text-brand-400">
                일자리 →
              </Link>
            </div>
          </div>
          {recentPosts.length === 0 ? (
            <p className="mt-4 text-sm text-black/50 dark:text-white/50">
              아직 등록된 글이 없습니다.
            </p>
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
