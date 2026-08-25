import Link from "next/link";
import { auth } from "@/lib/auth";
import { HomeHero } from "@/components/home/HomeHero";
import { StatStrip } from "@/components/home/StatStrip";
import { ActivityLog } from "@/components/home/ActivityLog";
import { OperatorsSection } from "@/components/home/OperatorsSection";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { WriteFab } from "@/components/home/WriteFab";
import { getHomeData } from "@/lib/homeData";
import { FarmerDashboard } from "@/components/dashboard/FarmerDashboard";
import { OperatorDashboard } from "@/components/dashboard/OperatorDashboard";
import { ExpertDashboard } from "@/components/dashboard/ExpertDashboard";
import { CompanyDashboard } from "@/components/dashboard/CompanyDashboard";
import { QuickLinkMenu } from "@/components/home/QuickLinkMenu";

export default async function HomePage() {
  const session = await auth();
  const loggedInUser = session?.user?.type === "user" ? session.user : null;

  if (loggedInUser) {
    // 세션의 role을 그대로 신뢰한다(역할은 관리자 승인 시 서버에서 갱신됨).
    const role = loggedInUser.role ?? "FARMER";
    const name = loggedInUser.name ?? "회원";

    return (
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
        <QuickLinkMenu />
        {role === "OPERATOR" && <OperatorDashboard userId={loggedInUser.id} name={name} />}
        {role === "EXPERT" && <ExpertDashboard userId={loggedInUser.id} name={name} />}
        {role === "COMPANY" && <CompanyDashboard userId={loggedInUser.id} name={name} />}
        {role === "FARMER" && <FarmerDashboard userId={loggedInUser.id} name={name} />}
      </div>
    );
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const { recentPosts, realOperators, stats } = await getHomeData(sevenDaysAgo.toISOString());

  return (
    <div className="pb-12">
      <WriteFab />
      <HomeHero />

      <div className="mt-8 sm:mt-12">
        <StatStrip
          farmerCount={stats.farmerCount}
          completedDroneCount={stats.completedDroneCount}
          weeklyPostCount={stats.weeklyPostCount}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <section className="mt-10 sm:mt-14">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">지금 모두의농부에서 일어나는 일</h2>
            <Link href="/products" className="text-sm text-brand-700 hover:underline">
              전체보기 →
            </Link>
          </div>
          <p className="mt-1 text-sm text-black/50">방금 등록된 매물과 일손 소식이에요.</p>
          <div className="mt-4">
            <ActivityLog posts={recentPosts} />
          </div>
        </section>

        <section className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">믿을 수 있는 방제사</h2>
            <Link href="/drones/operators" className="text-sm text-brand-700 hover:underline">
              더보기 →
            </Link>
          </div>
          <div className="mt-4">
            <OperatorsSection operators={realOperators} />
          </div>
        </section>

        <section className="mt-12 sm:mt-16">
          <h2 className="text-xl font-bold text-foreground">더 둘러보기</h2>
          <div className="mt-5">
            <CategoryStrip />
          </div>
        </section>
      </div>
    </div>
  );
}
