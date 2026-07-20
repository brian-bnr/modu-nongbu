import { prisma } from "@/lib/prisma";
import { EXPERT_SPECIALTY_LABEL } from "@/lib/format";
import { UserIcon, GridIcon, MessageIcon } from "@/components/icons/NavIcons";
import { DashboardShell, type DashboardAction } from "@/components/dashboard/DashboardShell";

// 상담·컨설팅 매칭 기능이 아직 없어 실데이터가 없으므로, 화면 구성을 보여주기 위한 예시 수치입니다.
const SAMPLE_STATS = { newInquiries: 3, answered: 2 };

const ACTIONS: DashboardAction[] = [
  { label: "농산물 거래", sublabel: "거래 둘러보기", href: "/products", iconSrc: "/icons/category/basket.png" },
  { label: "문의 내역", sublabel: "받은 문의 확인", href: "/my/inquiries", Icon: MessageIcon },
  { label: "내 정보", sublabel: "정보 관리", href: "/my", Icon: UserIcon },
  { label: "전체 서비스", sublabel: "서비스 둘러보기", href: "/services", Icon: GridIcon },
];

export async function ExpertDashboard({ userId, name }: { userId: string; name: string }) {
  const profile = await prisma.expertProfile.findUnique({ where: { userId } });

  return (
    <DashboardShell
      modeLabel="농업 전문가 모드"
      color="amber"
      name={name}
      heroTitle="농업 지식을 나누고 새로운 상담 기회를 만나보세요"
      heroSubtitle="유통·농자재 전문가와 농민을 연결합니다"
      heroHref="/my"
      actions={ACTIONS}
    >
      {profile && (
        <div className="mb-3 flex flex-wrap gap-2">
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

      <h3 className="text-sm font-bold">오늘의 주문/문의</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
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
