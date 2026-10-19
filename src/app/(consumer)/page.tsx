import { auth } from "@/lib/auth";
import { HeroCarousel } from "@/components/HeroCarousel";
import { BrowseSections } from "@/components/BrowseSections";
import { getHomeData } from "@/lib/homeData";
import { FarmerDashboard } from "@/components/dashboard/FarmerDashboard";
import { OperatorDashboard } from "@/components/dashboard/OperatorDashboard";
import { ExpertDashboard } from "@/components/dashboard/ExpertDashboard";
import { CompanyDashboard } from "@/components/dashboard/CompanyDashboard";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";

const HERO_SLIDES = [
  {
    image: "/hero-drone.png",
    tag: "방제 예약 시작!",
    title: (
      <>
        건강한 농작물,
        <br />
        모두의농부가 함께합니다
      </>
    ),
    subtitle: "드론 방제부터 위탁영농까지 한 번에 해결하세요",
    href: "/drones/new",
    gradient: "from-brand-700 to-brand-900",
  },
  {
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80",
    tag: "농업에 필요한 모든 연결을 한곳에서",
    title: <>모두의농부</>,
    subtitle: "농산물 거래부터 일손 구인까지, 대한민국 농업의 모든 연결이 이어지는 곳입니다",
    href: "/products",
    gradient: "from-accent-600 to-accent-800",
  },
];

export default async function HomePage() {
  const session = await auth();
  const loggedInUser = session?.user?.type === "user" ? session.user : null;

  if (loggedInUser) {
    // 역할 전환 시 switchRoleAction이 unstable_update로 JWT를 즉시 갱신하므로,
    // 여기서는 DB를 다시 조회할 필요 없이 세션의 role을 그대로 신뢰한다.
    const role = loggedInUser.role ?? "FARMER";
    const name = loggedInUser.name ?? "회원";

    return (
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
        <RoleSwitcher currentRole={role} />
        {role === "OPERATOR" && <OperatorDashboard userId={loggedInUser.id} name={name} />}
        {role === "EXPERT" && <ExpertDashboard userId={loggedInUser.id} name={name} />}
        {role === "COMPANY" && <CompanyDashboard userId={loggedInUser.id} name={name} />}
        {role === "FARMER" && <FarmerDashboard userId={loggedInUser.id} name={name} />}
      </div>
    );
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const homeData = await getHomeData(sevenDaysAgo.toISOString());

  return (
    <div>
      <HeroCarousel slides={HERO_SLIDES} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <BrowseSections {...homeData} />
      </div>
    </div>
  );
}
