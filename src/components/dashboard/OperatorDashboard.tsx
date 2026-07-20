import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

export async function OperatorDashboard({ userId, name }: { userId: string; name: string }) {
  const operator = await prisma.droneOperator.findUnique({ where: { userId } });

  if (!operator) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-xs text-black/50 dark:text-white/50">방제사 모드</p>
        <h2 className="mt-1 text-lg font-bold">방제사 정보가 없어요</h2>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          방제사 신청 내역을 찾을 수 없습니다. 마이페이지에서 다시 신청해주세요.
        </p>
      </div>
    );
  }

  if (operator.status !== "APPROVED") {
    const copy = STATUS_COPY[operator.status];
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <p className="text-xs text-black/50 dark:text-white/50">방제사 모드</p>
        <h2 className="mt-1 text-lg font-bold">{name}님, {copy.title}</h2>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">{copy.body}</p>
      </div>
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
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-black/50 dark:text-white/50">방제사 모드</p>
          <h2 className="text-lg font-bold">안녕하세요, {name}님!</h2>
        </div>
        <Link
          href="/drones/operator"
          className="rounded-full bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
        >
          작업 보기
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/10 pt-4 text-center text-sm dark:border-white/10">
        <div>
          <p className="font-semibold">{todayAssignedCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">오늘 배정</p>
        </div>
        <div>
          <p className="font-semibold">{inProgressCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">작업중</p>
        </div>
        <div>
          <p className="font-semibold">{monthlyPayout.toLocaleString("ko-KR")}원</p>
          <p className="text-xs text-black/50 dark:text-white/50">이번달 정산액</p>
        </div>
      </div>
    </div>
  );
}
