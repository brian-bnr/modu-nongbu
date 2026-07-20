import { prisma } from "@/lib/prisma";

// 업체 구매·계약 매칭 기능이 아직 없어 실데이터가 없으므로, 화면 구성을 보여주기 위한 예시 수치입니다.
const SAMPLE_STATS = { purchaseRequests: 5, contractsInProgress: 2 };

export async function CompanyDashboard({ userId, name }: { userId: string; name: string }) {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <p className="text-xs text-black/50 dark:text-white/50">업체 모드</p>
      <h2 className="mt-1 text-lg font-bold">안녕하세요, {name}님!</h2>

      {profile ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.companyType && (
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
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
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-black/10 pt-4 text-center text-sm dark:border-white/10">
        <div>
          <p className="font-semibold">{SAMPLE_STATS.purchaseRequests}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">구매 요청</p>
        </div>
        <div>
          <p className="font-semibold">{SAMPLE_STATS.contractsInProgress}건</p>
          <p className="text-xs text-black/50 dark:text-white/50">계약 진행중</p>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-black/5 p-3 text-xs text-black/50 dark:bg-white/10 dark:text-white/50">
        업체 구매·계약재배 연결 기능을 준비하고 있어요. 위 수치는 화면 구성을 보여주기 위한 예시예요.
      </p>
    </div>
  );
}
