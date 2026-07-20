import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { DRONE_RESERVATION_STATUS_VARIANT, formatPrice } from "@/lib/format";
import { UserIcon, CalendarIcon } from "@/components/icons/NavIcons";
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

function buildActions(operatorId: string | null): DashboardAction[] {
  return [
    { label: "오늘의 작업", sublabel: "일자리 목록", href: "/drones/operator", iconSrc: "/icons/category/drone.png" },
    { label: "내 일정", sublabel: "일정 관리", href: "/drones/operator", Icon: CalendarIcon },
    {
      label: "정산 내역",
      sublabel: "수익 확인",
      href: "/drones/operator/settlements",
      iconSrc: "/icons/category/bank.png",
    },
    operatorId
      ? {
          label: "내 프로필",
          sublabel: "공개 페이지 보기",
          href: `/drones/operators/${operatorId}`,
          Icon: UserIcon,
        }
      : { label: "내 정보", sublabel: "정보 관리", href: "/my", Icon: UserIcon },
  ];
}

export async function OperatorDashboard({ userId, name }: { userId: string; name: string }) {
  const operator = await prisma.droneOperator.findUnique({ where: { userId } });

  if (!operator) {
    return (
      <DashboardShell
        modeLabel="방제사 모드"
        color="blue"
        name={name}
        heroTitle="오늘의 일자리를 확인하고 효율적으로 일정을 관리하세요"
        heroSubtitle="더 많은 일자리, 더 쉬운 관리"
        heroHref="/drones/operator"
        actions={buildActions(null)}
      >
        <p className="rounded-xl bg-black/5 p-3 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
          방제사 신청 내역을 찾을 수 없습니다. 마이페이지에서 다시 신청해주세요.
        </p>
      </DashboardShell>
    );
  }

  const actions = buildActions(operator.id);

  if (operator.status !== "APPROVED") {
    const copy = STATUS_COPY[operator.status];
    return (
      <DashboardShell
        modeLabel="방제사 모드"
        color="blue"
        name={name}
        heroTitle="오늘의 일자리를 확인하고 효율적으로 일정을 관리하세요"
        heroSubtitle="더 많은 일자리, 더 쉬운 관리"
        heroHref="/drones/operator"
        actions={actions}
      >
        <p className="rounded-xl bg-black/5 p-3 text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
          <span className="block font-semibold text-black/80 dark:text-white/80">{copy.title}</span>
          <span className="mt-1 block">{copy.body}</span>
        </p>
      </DashboardShell>
    );
  }

  const todayJobs = await prisma.droneReservation.findMany({
    where: {
      operatorId: operator.id,
      status: { in: ["ASSIGNED", "IN_PROGRESS", "COMPLETION_REQUESTED"] },
    },
    orderBy: { desiredDate: "asc" },
    take: 3,
  });

  return (
    <DashboardShell
      modeLabel="방제사 모드"
      color="blue"
      name={name}
      heroTitle="오늘의 일자리를 확인하고 효율적으로 일정을 관리하세요"
      heroSubtitle="더 많은 일자리, 더 쉬운 관리"
      heroHref="/drones/operator"
      actions={actions}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">오늘의 일자리</h3>
        <Link href="/drones/operator" className="text-xs text-brand-700 hover:underline dark:text-brand-400">
          전체보기 →
        </Link>
      </div>

      {todayJobs.length === 0 ? (
        <p className="mt-3 rounded-xl bg-black/5 p-3 text-sm text-black/50 dark:bg-white/10 dark:text-white/50">
          배정된 작업이 없어요.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {todayJobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/drones/operator/${job.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-black/5 p-3 text-sm transition hover:border-blue-500 dark:border-white/10"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {job.region}
                    {job.regionDetail ? ` ${job.regionDetail}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                    {job.areaPyeong.toLocaleString("ko-KR")}평 ·{" "}
                    {job.desiredDate.toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[job.status]}>
                  {formatPrice(job.totalPrice)}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
