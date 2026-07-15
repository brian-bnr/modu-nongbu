import type { ComponentType } from "react";
import {
  DroneSprayIcon,
  TractorFlatIcon,
  SproutPotIcon,
  BasketIcon,
  FarmerIcon,
  PinIcon,
  CartIcon,
  NewsIcon,
  BankIcon,
  GradCapIcon,
} from "@/components/icons/CategoryIcons";

export type CategoryTile = {
  href: string;
  Icon: ComponentType<{ className?: string }>;
  label: string;
  comingSoon?: boolean;
};

export const CATEGORY_TILES: CategoryTile[] = [
  { href: "/drones/new", Icon: DroneSprayIcon, label: "방제 신청" },
  { href: "/consign-farming", Icon: TractorFlatIcon, label: "위탁영농", comingSoon: true },
  { href: "/seedlings", Icon: SproutPotIcon, label: "육묘신청", comingSoon: true },
  { href: "/products/new?type=SELL_PRODUCT", Icon: BasketIcon, label: "농산물 판매" },
  { href: "/jobs/new?type=FIND_WORKER", Icon: FarmerIcon, label: "농작업 구인" },
  { href: "/drones/operators", Icon: PinIcon, label: "내 주변 방제사" },
  { href: "/farm-supplies", Icon: CartIcon, label: "농자재 쇼핑", comingSoon: true },
  { href: "/info", Icon: NewsIcon, label: "농업 뉴스", comingSoon: true },
  { href: "/gov-support", Icon: BankIcon, label: "정부지원사업", comingSoon: true },
  { href: "/education", Icon: GradCapIcon, label: "농업교육", comingSoon: true },
];
