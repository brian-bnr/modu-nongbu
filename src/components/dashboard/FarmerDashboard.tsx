import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-black/50 dark:text-white/50">농민 모드</p>
          <h2 className="text-lg font-bold">안녕하세요, {name}님!</h2>
        </div>
        <Link
          href="/drones/new"
          className="rounded-full bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
        >
          방제 신청
        </Link>
      </div>

      {nextReservation ? (
        <div className="mt-4 rounded-xl bg-brand-50 p-3 dark:bg-brand-900/20">
          <p className="text-xs text-black/50 dark:text-white/50">다가오는 방제 일정</p>
          <p className="mt-1 text-sm font-semibold">
            {nextReservation.desiredDate.toLocaleDateString("ko-KR")} · {nextReservation.cropType} ·{" "}
            {nextReservation.areaPyeong.toLocaleString("ko-KR")}평
          </p>
          <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
            {STATUS_LABEL[nextReservation.status] ?? nextReservation.status}
          </p>
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-black/5 p-3 text-sm text-black/50 dark:bg-white/10 dark:text-white/50">
          예정된 방제 일정이 없어요.
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-black/10 pt-4 text-center text-sm dark:border-white/10">
        <Link
          href="/drones"
          className="rounded-lg py-1 transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          <p className="font-semibold">{totalCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">전체 방제 신청</p>
        </Link>
        <Link
          href="/drones?status=COMPLETED"
          className="rounded-lg py-1 transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          <p className="font-semibold">{completedCount}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">완료</p>
        </Link>
      </div>
    </div>
  );
}

