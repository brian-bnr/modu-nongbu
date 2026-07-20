import type { ComponentType } from "react";
import {
  DroneSprayIcon,
  FarmerIcon,
  SproutPotIcon,
  BottleIcon,
  TractorFlatIcon,
  HandshakeIcon,
  RiceBagIcon,
  BasketIcon,
  BankIcon,
  ShieldWonIcon,
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
    Icon: FarmerIcon,
    label: "위탁영농",
    comingSoon: true,
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    href: "/seedlings",
    Icon: SproutPotIcon,
    label: "육묘 주문",
    comingSoon: true,
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    href: "/farm-supplies",
    Icon: BottleIcon,
    label: "농약·비료",
    comingSoon: true,
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    href: "/machines",
    Icon: TractorFlatIcon,
    label: "농기계",
    comingSoon: true,
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    href: "/contract-farming",
    Icon: HandshakeIcon,
    label: "계약재배",
    comingSoon: true,
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    href: "/rice",
    Icon: RiceBagIcon,
    label: "모두의농부 쌀",
    comingSoon: true,
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    href: "/products",
    Icon: BasketIcon,
    label: "농산물 거래",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    href: "/finance",
    Icon: BankIcon,
    label: "농업금융",
    comingSoon: true,
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    href: "/insurance",
    Icon: ShieldWonIcon,
    label: "농업보험",
    comingSoon: true,
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
];
