export type CategoryTile = {
  href: string;
  iconSrc: string;
  label: string;
  comingSoon?: boolean;
};

export const CATEGORY_TILES: CategoryTile[] = [
  {
    href: "/drones/new",
    iconSrc: "/icons/category/drone.png",
    label: "방제 신청",
  },
  {
    href: "/consign-farming",
    iconSrc: "/icons/category/farmer.png",
    label: "위탁영농",
    comingSoon: true,
  },
  {
    href: "/seedlings",
    iconSrc: "/icons/category/sprout.png",
    label: "육묘 주문",
    comingSoon: true,
  },
  {
    href: "/farm-supplies",
    iconSrc: "/icons/category/bottle.png",
    label: "농약·비료",
    comingSoon: true,
  },
  {
    href: "/machines",
    iconSrc: "/icons/category/tractor.png",
    label: "농기계",
    comingSoon: true,
  },
  {
    href: "/contract-farming",
    iconSrc: "/icons/category/handshake.png",
    label: "계약재배",
    comingSoon: true,
  },
  {
    href: "/rice",
    iconSrc: "/icons/category/ricebag.png",
    label: "모두의농부 쌀",
    comingSoon: true,
  },
  {
    href: "/products",
    iconSrc: "/icons/category/basket.png",
    label: "농산물 거래",
  },
  {
    href: "/finance",
    iconSrc: "/icons/category/bank.png",
    label: "농업금융",
    comingSoon: true,
  },
  {
    href: "/insurance",
    iconSrc: "/icons/category/shield.png",
    label: "농업보험",
    comingSoon: true,
  },
];
