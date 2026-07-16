import type { ComponentType } from "react";
import {
  DroneSprayIcon,
  TractorFlatIcon,
  SproutPotIcon,
  BasketIcon,
  FarmerIcon,
  PinIcon,
  CartIcon,
  VideoIcon,
  MegaphoneIcon,
  NewsIcon,
} from "@/components/icons/CategoryIcons";

export type CategoryTile = {
  href: string;
  Icon: ComponentType<{ className?: string }>;
  label: string;
  comingSoon?: boolean;
  bg: string;
};

export const CATEGORY_TILES: CategoryTile[] = [
  {
    href: "/drones/new",
    Icon: DroneSprayIcon,
    label: "방제 신청",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    href: "/consign-farming",
    Icon: TractorFlatIcon,
    label: "위탁영농",
    comingSoon: true,
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    href: "/seedlings",
    Icon: SproutPotIcon,
    label: "종자판매",
    comingSoon: true,
    bg: "bg-lime-100 dark:bg-lime-900/30",
  },
  {
    href: "/products/new?type=SELL_PRODUCT",
    Icon: BasketIcon,
    label: "농산물 판매",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    href: "/jobs/new?type=FIND_WORKER",
    Icon: FarmerIcon,
    label: "농작업 구인",
    bg: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    href: "/drones/operators",
    Icon: PinIcon,
    label: "내 주변 방제사",
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    href: "/farm-supplies",
    Icon: CartIcon,
    label: "농자재 쇼핑",
    comingSoon: true,
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    href: "/bnr-videos",
    Icon: VideoIcon,
    label: "비앤알영상",
    comingSoon: true,
    bg: "bg-rose-100 dark:bg-rose-900/30",
  },
  {
    href: "/news",
    Icon: MegaphoneIcon,
    label: "농부소식",
    comingSoon: true,
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    href: "/info",
    Icon: NewsIcon,
    label: "농업뉴스",
    comingSoon: true,
    bg: "bg-sky-100 dark:bg-sky-900/30",
  },
];
