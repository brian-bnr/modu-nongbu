import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UserIcon, GridIcon } from "@/components/icons/NavIcons";
import { DashboardShell, type DashboardAction } from "@/components/dashboard/DashboardShell";

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: "요청됨",
  PAID: "결제완료",
  ASSIGNED: "배정완료",
  IN_PROGRESS: "작업중",
  COMPLETION_REQUESTED: "완료확인대기",
  COMPLETED: "완료",
  CANCELLED: "취소됨",
  DISPUTED: "분쟁중",
};

const ACTIONS: DashboardAction[] = [
  { label: "방제 신청", href: "/drones/new", iconSrc: "/icons/category/drone.png" },
  { label: "위탁영농", href: "/consign-farming", iconSrc: "/icons/category/farmer.png" },
  { label: "내 정보", href: "/my", Icon: UserIcon },
  { label: "전체 서비스", href: "/services", Icon: GridIcon },
];

export async function FarmerDashboard({ userId, name }: { userId: string; name: string }) {
  const [nextReservation, totalCount, completedCount] = await Promise.all([
    prisma.droneReservation.findFirst({
      where: {
        farmerId: userId,
        status: { in: ["PAID", "ASSIGNED", "IN_PROGRESS", "COMPLETION_REQUESTED"] },
      },
      orderBy: { desiredDate: "asc" },
    }),
    prisma.droneReservation.count({ where: { farmerId: userId } }),
    prisma.droneReservation.count({ where: { farmerId: userId, status: "COMPLETED" } }),
  ]);

  return (
    <DashboardShell modeLabel="농민 모드" color="green" name={name} actions={ACTIONS}>
      <p className="mt-4 text-xs font-medium text-black/40 dark:text-white/40">오늘의 일정</p>
      {nextReservation ? (
        <div className="mt-1.5 rounded-xl bg-brand-50 p-3 dark:bg-brand-900/20">
          <p className="text-sm font-semibold">
            {nextReservation.desiredDate.toLocaleDateString("ko-KR")} · {nextReservation.cropType} ·{" "}
            {nextReservation.areaPyeong.toLocaleString("ko-KR")}평
          </p>
          <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
            {STATUS_LABEL[nextReservation.status] ?? nextReservation.status}
          </p>
        </div>
      ) : (
        <p className="mt-1.5 rounded-xl bg-black/5 p-3 text-sm text-black/50 dark:bg-white/10 dark:text-white/50">
          예정된 방제 일정이 없어요.
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
        <Link
          href="/drones"
          className="rounded-lg bg-black/[0.03] py-2 transition hover:bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <p className="font-semibold">{totalCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">전체 방제 신청</p>
        </Link>
        <Link
          href="/drones?status=COMPLETED"
          className="rounded-lg bg-black/[0.03] py-2 transition hover:bg-black/5 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <p className="font-semibold">{completedCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">완료</p>
        </Link>
      </div>
    </DashboardShell>
  );
}
