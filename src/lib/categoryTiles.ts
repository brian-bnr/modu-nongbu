export type CategoryTile = {
  href: string;
  emoji: string;
  label: string;
  color: string;
  comingSoon?: boolean;
};

export const CATEGORY_TILES: CategoryTile[] = [
  { href: "/drones/new", emoji: "🚁", label: "방제 신청", color: "bg-teal-500" },
  { href: "/consign-farming", emoji: "🌾", label: "위탁영농", color: "bg-lime-600", comingSoon: true },
  { href: "/seedlings", emoji: "🌱", label: "육묘신청", color: "bg-emerald-500", comingSoon: true },
  { href: "/products/new?type=SELL_PRODUCT", emoji: "🥬", label: "농산물 판매", color: "bg-brand-500" },
  { href: "/jobs/new?type=FIND_WORKER", emoji: "🧑‍🌾", label: "농작업 구인", color: "bg-blue-500" },
  { href: "/drones/operators", emoji: "📍", label: "내 주변 방제사", color: "bg-sky-600" },
  { href: "/farm-supplies", emoji: "🛒", label: "농자재 쇼핑", color: "bg-orange-500", comingSoon: true },
  { href: "/info", emoji: "📰", label: "농업 뉴스", color: "bg-cyan-600", comingSoon: true },
  { href: "/gov-support", emoji: "🏛️", label: "정부지원사업", color: "bg-indigo-500", comingSoon: true },
  { href: "/education", emoji: "🎓", label: "농업교육", color: "bg-rose-500", comingSoon: true },
];
