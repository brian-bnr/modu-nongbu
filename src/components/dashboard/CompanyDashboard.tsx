import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UserIcon, GridIcon, MessageIcon } from "@/components/icons/NavIcons";
import { DashboardShell, type DashboardAction } from "@/components/dashboard/DashboardShell";

// 업체 구매·계약 매칭 기능이 아직 없어 실데이터가 없으므로, 화면 구성을 보여주기 위한 예시 수치입니다.
const SAMPLE_STATS = { purchaseRequests: 5, contractsInProgress: 2 };

const ACTIONS: DashboardAction[] = [
  { label: "농산물 거래", sublabel: "구매처 찾기", href: "/products", iconSrc: "/icons/category/basket.png" },
  { label: "문의 내역", sublabel: "받은 문의 확인", href: "/my/inquiries", Icon: MessageIcon },
  { label: "내 정보", sublabel: "정보 관리", href: "/my", Icon: UserIcon },
  { label: "전체 서비스", sublabel: "서비스 둘러보기", href: "/services", Icon: GridIcon },
];

export async function CompanyDashboard({ userId, name }: { userId: string; name: string }) {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });

  return (
    <DashboardShell
      modeLabel="업체 모드"
      color="purple"
      name={name}
      heroTitle="농산물 구매와 계약재배를 한 곳에서 관리하세요"
      heroSubtitle="농가와 업체를 직접 연결합니다"
      heroHref="/products"
      actions={ACTIONS}
    >
      {profile && (
        <div className="mb-3 flex flex-wrap gap-2">
          {profile.companyType && (
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
              {profile.companyType}
            </span>
          )}
          {profile.mainItem && (
            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
              주요 품목: {profile.mainItem}
            </span>
          )}
          {profile.activityRegion && (
            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
              {profile.activityRegion} 활동
            </span>
          )}
        </div>
      )}

      <h3 className="text-sm font-bold">오늘의 거래</h3>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
        <Link
          href="/company-deals"
          className="rounded-lg bg-black/[0.03] py-2 transition hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10"
        >
          <p className="font-semibold">{SAMPLE_STATS.purchaseRequests}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">구매 요청</p>
        </Link>
        <Link
          href="/company-deals"
          className="rounded-lg bg-black/[0.03] py-2 transition hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10"
        >
          <p className="font-semibold">{SAMPLE_STATS.contractsInProgress}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">계약 진행중</p>
        </Link>
      </div>

      <p className="mt-3 rounded-xl bg-black/5 p-3 text-xs text-black/50 dark:bg-white/10 dark:text-white/50">
        업체 구매·계약재배 연결 기능을 준비하고 있어요. 위 수치는 화면 구성을 보여주기 위한 예시예요.
      </p>
    </DashboardShell>
  );
}
