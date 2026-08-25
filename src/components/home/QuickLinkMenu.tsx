import Image from "next/image";
import Link from "next/link";

type QuickLink = {
  href: string;
  iconSrc: string;
  label: string;
  comingSoon?: boolean;
};

const QUICK_LINKS: QuickLink[] = [
  { href: "/drones/new", iconSrc: "/icons/category/drone.png", label: "드론 방제 신청" },
  { href: "/jobs/new?type=FIND_WORKER", iconSrc: "/icons/category/farmer.png", label: "농촌 일손 요청" },
  { href: "/weekend-farm", iconSrc: "/icons/category/sprout.png", label: "주말농장 검색", comingSoon: true },
  { href: "/products", iconSrc: "/icons/category/basket.png", label: "농산물 직거래" },
  { href: "/local-prices", iconSrc: "/icons/category/bank.png", label: "우리동네 농산물 가격", comingSoon: true },
  { href: "/used-drones", iconSrc: "/icons/category/handshake.png", label: "중고 드론 거래", comingSoon: true },
];

export function QuickLinkMenu() {
  return (
    <div className="mb-3 rounded-2xl border border-black/10 bg-white px-3 py-4 dark:border-white/10 dark:bg-white/5">
      <div className="grid grid-cols-3 gap-x-2 gap-y-4">
        {QUICK_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <Image
                src={item.iconSrc}
                alt=""
                width={56}
                height={56}
                className="h-full w-full rounded-full object-cover"
              />
              {item.comingSoon && (
                <span className="absolute -bottom-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  준비중
                </span>
              )}
            </span>
            <span className="w-16 break-keep text-center text-[11px] font-medium leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
