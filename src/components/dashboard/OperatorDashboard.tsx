import { prisma } from "@/lib/prisma";
import { UserIcon, GridIcon } from "@/components/icons/NavIcons";
import { DashboardShell, type DashboardAction } from "@/components/dashboard/DashboardShell";

const STATUS_COPY: Record<string, { title: string; body: string }> = {
  PENDING: {
    title: "승인 대기중이에요",
    body: "신청이 접수되었습니다. 관리자 승인 후 방제사로 활동하실 수 있어요.",
  },
  REJECTED: {
    title: "승인이 거절되었어요",
    body: "방제사 신청이 거절되었습니다. 문의사항은 고객센터로 연락해주세요.",
  },
  SUSPENDED: {
    title: "활동이 정지되었어요",
    body: "현재 방제사 활동이 일시 정지된 상태입니다. 고객센터로 문의해주세요.",
  },
};

const ACTIONS: DashboardAction[] = [
  { label: "작업 보기", href: "/drones/operator", iconSrc: "/icons/category/drone.png" },
  { label: "방제사 목록", href: "/drones/operators", iconSrc: "/icons/roles/operator.png" },
  { label: "내 정보", href: "/my", Icon: UserIcon },
  { label: "전체 서비스", href: "/services", Icon: GridIcon },
];

export async function OperatorDashboard({ userId, name }: { userId: string; name: string }) {
  const operator = await prisma.droneOperator.findUnique({ where: { userId } });

  if (!operator) {
    return (
      <DashboardShell modeLabel="방제사 모드" color="blue" name={name} actions={ACTIONS}>
        <p className="mt-3 rounded-xl bg-black/5 p-3 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
          방제사 신청 내역을 찾을 수 없습니다. 마이페이지에서 다시 신청해주세요.
        </p>
      </DashboardShell>
    );
  }

  if (operator.status !== "APPROVED") {
    const copy = STATUS_COPY[operator.status];
    return (
      <DashboardShell modeLabel="방제사 모드" color="blue" name={name} actions={ACTIONS}>
        <p className="mt-3 rounded-xl bg-black/5 p-3 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
          <span className="block font-semibold text-black/80 dark:text-white/80">{copy.title}</span>
          <span className="mt-1 block">{copy.body}</span>
        </p>
      </DashboardShell>
    );
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayAssignedCount, inProgressCount, settlements] = await Promise.all([
    prisma.droneReservation.count({
      where: {
        operatorId: operator.id,
        desiredDate: { gte: todayStart, lt: todayEnd },
        status: { in: ["ASSIGNED", "IN_PROGRESS", "COMPLETION_REQUESTED", "COMPLETED"] },
      },
    }),
    prisma.droneReservation.count({
      where: { operatorId: operator.id, status: "IN_PROGRESS" },
    }),
    prisma.settlement.findMany({
      where: { operatorId: operator.id, createdAt: { gte: monthStart } },
      select: { payoutAmount: true },
    }),
  ]);

  const monthlyPayout = settlements.reduce((sum, s) => sum + s.payoutAmount, 0);

  return (
    <DashboardShell modeLabel="방제사 모드" color="blue" name={name} actions={ACTIONS}>
      <p className="mt-4 text-xs font-medium text-black/40 dark:text-white/40">오늘의 작업</p>
      <div className="mt-1.5 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-black/[0.03] py-2 dark:bg-white/5">
          <p className="font-semibold">{todayAssignedCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">오늘 배정</p>
        </div>
        <div className="rounded-lg bg-black/[0.03] py-2 dark:bg-white/5">
          <p className="font-semibold">{inProgressCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">작업중</p>
        </div>
        <div className="rounded-lg bg-black/[0.03] py-2 dark:bg-white/5">
          <p className="font-semibold">{monthlyPayout.toLocaleString("ko-KR")}원</p>
          <p className="text-xs text-black/50 dark:text-white/50">이번달 정산액</p>
        </div>
      </div>
    </DashboardShell>
  );
}
