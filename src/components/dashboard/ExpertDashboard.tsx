import { prisma } from "@/lib/prisma";
import { EXPERT_SPECIALTY_LABEL } from "@/lib/format";
import { UserIcon, GridIcon } from "@/components/icons/NavIcons";
import { DashboardShell, type DashboardAction } from "@/components/dashboard/DashboardShell";

// 상담·컨설팅 매칭 기능이 아직 없어 실데이터가 없으므로, 화면 구성을 보여주기 위한 예시 수치입니다.
const SAMPLE_STATS = { newInquiries: 3, answered: 2 };

const ACTIONS: DashboardAction[] = [
  { label: "농산물 거래", href: "/products", iconSrc: "/icons/category/basket.png" },
  { label: "문의 내역", href: "/my/inquiries", Icon: UserIcon },
  { label: "내 정보", href: "/my", Icon: UserIcon },
  { label: "전체 서비스", href: "/services", Icon: GridIcon },
];

export async function ExpertDashboard({ userId, name }: { userId: string; name: string }) {
  const profile = await prisma.expertProfile.findUnique({ where: { userId } });

  return (
    <DashboardShell modeLabel="농업 전문가 모드" color="amber" name={name} actions={ACTIONS}>
      {profile && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            {EXPERT_SPECIALTY_LABEL[profile.specialty] ?? profile.specialty} 분야
          </span>
          {profile.activityRegion && (
            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
              {profile.activityRegion} 활동
            </span>
          )}
        </div>
      )}

      <p className="mt-3 text-xs font-medium text-black/40 dark:text-white/40">오늘의 주문/문의</p>
      <div className="mt-1.5 grid grid-cols-2 gap-2 text-center text-sm">
        <div className="rounded-lg bg-black/[0.03] py-2 dark:bg-white/5">
          <p className="font-semibold">{SAMPLE_STATS.newInquiries}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">오늘 신규 문의</p>
        </div>
        <div className="rounded-lg bg-black/[0.03] py-2 dark:bg-white/5">
          <p className="font-semibold">{SAMPLE_STATS.answered}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">답변 완료</p>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-black/5 p-3 text-xs text-black/50 dark:bg-white/10 dark:text-white/50">
        상담·컨설팅 연결 기능을 준비하고 있어요. 위 수치는 화면 구성을 보여주기 위한 예시예요.
      </p>
    </DashboardShell>
  );
}
