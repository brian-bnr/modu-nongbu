import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";

const ENTRY_CARDS = [
  {
    href: "/products/new?type=SELL_PRODUCT",
    emoji: "🥬",
    title: "농산물을 판매하고 싶어요",
    subtitle: "농민",
    desc: "직접 키운 농산물을 등록하고 소비자에게 바로 판매해보세요.",
    classes:
      "bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-100",
  },
  {
    href: "/products/new?type=BUY_PRODUCT",
    emoji: "🛒",
    title: "농산물을 구매하고 싶어요",
    subtitle: "소비자",
    desc: "믿을 수 있는 농민에게 신선한 농산물을 직접 구매해보세요.",
    classes:
      "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-100",
  },
  {
    href: "/jobs/new?type=FIND_WORKER",
    emoji: "🧑‍🌾",
    title: "일손이 필요해요",
    subtitle: "농가",
    desc: "바쁜 농번기, 필요한 일손을 빠르게 구해보세요.",
    classes:
      "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
  },
  {
    href: "/jobs/new?type=LOOKING_FOR_WORK",
    emoji: "🙋",
    title: "일을 하고 싶어요",
    subtitle: "도시인 · 작업자",
    desc: "체력에 자신 있다면 근처 농가에서 일해보세요.",
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
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-accent-50 via-brand-50 to-brand-100 dark:from-brand-900/50 dark:via-brand-900/30 dark:to-accent-700/20">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-8 sm:py-16">
          <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
            농업에 필요한 모든 연결을 한곳에서
          </span>
          <h1 className="mt-4 text-3xl font-bold text-brand-900 sm:text-4xl dark:text-brand-50">
            모두의농부
          </h1>
          <p className="mt-3 text-brand-900/70 dark:text-brand-100/80">
            지금 나는 무엇을 하려는 사람인가요?
            <br />
            아래에서 바로 시작해보세요.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <section>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {ENTRY_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-8 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-10 ${card.classes}`}
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
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-black/[0.02] px-6 py-8 sm:px-10 dark:bg-white/5">
          <h2 className="text-xl font-semibold">곧 만나요</h2>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            농기계·드론·농업서비스·정보 공유까지, 모두의농부가 준비하고 있어요.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SOON_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-black/10 bg-white/60 p-5 text-center text-black/50 transition hover:border-black/20 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10"
              >
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-sm font-medium">{card.title}</span>
              </Link>
            ))}
          </div>
        </section>

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
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
