import Image from "next/image";
import Link from "next/link";

const ENTRIES = [
  {
    href: "/drones/new",
    iconSrc: "/icons/category/drone.png",
    title: "방제 신청",
    subtitle: "예약부터 정산까지, 드론 방제사와 안전하게 연결돼요",
    cta: "방제 신청하기",
  },
  {
    href: "/products",
    iconSrc: "/icons/category/basket.png",
    title: "농산물 거래",
    subtitle: "우리 지역 농가의 매물을 찾고 바로 문의해요",
    cta: "매물 둘러보기",
  },
];

export function HomeHero() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-8 sm:pt-12">
      <h1 className="max-w-xl break-keep text-2xl font-bold leading-snug text-foreground sm:text-4xl">
        건강한 농작물, 모두의농부가 함께합니다
      </h1>
      <p className="mt-2 max-w-md break-keep text-sm text-black/60 sm:mt-3 sm:text-base">
        방제와 거래, 무엇이 먼저든 여기서 시작하세요.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
        {ENTRIES.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 transition hover:border-brand-300 hover:shadow-md sm:p-6"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-50 sm:h-16 sm:w-16">
              <Image src={entry.iconSrc} alt="" width={40} height={40} className="h-8 w-8 object-contain sm:h-10 sm:w-10" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground sm:text-xl">{entry.title}</p>
              <p className="mt-0.5 break-keep text-xs text-black/55 sm:text-sm">{entry.subtitle}</p>
              <p className="mt-2 text-sm font-semibold text-brand-700 group-hover:underline">
                {entry.cta} →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
