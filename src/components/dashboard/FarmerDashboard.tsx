import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { DRONE_RESERVATION_STATUS_LABEL, DRONE_RESERVATION_STATUS_VARIANT, formatPrice } from "@/lib/format";
import { BriefcaseIcon, GridIcon } from "@/components/icons/NavIcons";
import { DashboardShell, type DashboardAction } from "@/components/dashboard/DashboardShell";

const ACTIONS: DashboardAction[] = [
  { label: "방제 신청", sublabel: "방제 요청하기", href: "/drones/new", iconSrc: "/icons/category/drone.png" },
  {
    label: "일손요청",
    sublabel: "일손 구하기",
    href: "/jobs/new?type=FIND_WORKER",
    Icon: BriefcaseIcon,
  },
  {
    label: "농산물 판매",
    sublabel: "판매글 등록",
    href: "/products/new?type=SELL_PRODUCT",
    iconSrc: "/icons/category/basket.png",
  },
  { label: "전체 서비스", sublabel: "서비스 둘러보기", href: "/services", Icon: GridIcon },
];

export async function FarmerDashboard({ userId, name }: { userId: string; name: string }) {
  const recentReservations = await prisma.droneReservation.findMany({
    where: { farmerId: userId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <DashboardShell
      modeLabel="농민 모드"
      color="green"
      name={name}
      heroTitle="간편하게 방제 요청하고 믿을 수 있는 방제사와 연결하세요"
      heroSubtitle="드론 방제부터 위탁영농까지 한 번에"
      heroHref="/drones/new"
      actions={ACTIONS}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">최근 신청 내역</h3>
        <Link href="/drones" className="text-xs text-brand-700 hover:underline dark:text-brand-400">
          전체보기 →
        </Link>
      </div>

      {recentReservations.length === 0 ? (
        <p className="mt-3 text-sm text-black/50">아직 신청한 방제 예약이 없어요.</p>
      ) : (
        <ul className="mt-1">
          {recentReservations.map((r) => (
            <li key={r.id} className="border-b border-black/10 last:border-b-0">
              <Link
                href={`/drones/${r.id}`}
                className="flex items-center justify-between gap-3 py-3 text-sm transition hover:bg-black/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {r.region}
                    {r.regionDetail ? ` ${r.regionDetail}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-black/50">
                    {r.areaPyeong.toLocaleString("ko-KR")}평 · {formatPrice(r.totalPrice)}
                  </p>
                </div>
                <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[r.status]}>
                  {DRONE_RESERVATION_STATUS_LABEL[r.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
