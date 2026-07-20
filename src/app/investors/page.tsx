import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const metadata = {
  title: "모두의농부 | 투자자 소개",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const HERO_SERVICES: {
  icon: string;
  label: string;
  href: string | null;
}[] = [
  { icon: "🚁", label: "방제 신청", href: "/drones/new" },
  { icon: "🌱", label: "위탁영농", href: "/consign-farming" },
  { icon: "🌾", label: "농산물 판매", href: "/products" },
  { icon: "📦", label: "농약·비료 주문", href: "/farm-supplies" },
  { icon: "🤝", label: "전문가 연결", href: null },
  { icon: "📄", label: "작업이력", href: "/drones" },
];

const ROADMAP: { icon: string; label: string; live: boolean }[] = [
  { icon: "/icons/category/drone.png", label: "방제", live: true },
  { icon: "/icons/category/farmer.png", label: "위탁영농", live: false },
  { icon: "/icons/category/sprout.png", label: "육묘", live: false },
  { icon: "/icons/category/bottle.png", label: "농약·비료", live: false },
  { icon: "/icons/category/tractor.png", label: "농기계", live: false },
  { icon: "/icons/category/handshake.png", label: "계약재배", live: false },
  { icon: "/icons/category/ricebag.png", label: "브랜드 쌀", live: false },
  { icon: "/icons/category/basket.png", label: "농산물 거래", live: true },
  { icon: "/icons/category/bank.png", label: "농업금융", live: false },
  { icon: "/icons/category/shield.png", label: "농업보험", live: false },
];

const USE_OF_FUNDS = [
  "개발자 채용",
  "AI 기능 고도화",
  "서버 운영",
  "유지보수",
  "고객센터(CS)",
  "영업 인력",
  "전국 파트너 확보",
  "마케팅",
];

export default async function InvestorsPage() {
  const [
    reservationCount,
    completedCount,
    farmerCount,
    approvedOperatorCount,
    gmvAgg,
    commissionAgg,
  ] = await Promise.all([
    prisma.droneReservation.count(),
    prisma.droneReservation.count({ where: { status: "COMPLETED" } }),
    prisma.user.count({ where: { role: "FARMER" } }),
    prisma.droneOperator.count({ where: { status: "APPROVED" } }),
    prisma.droneReservation.aggregate({
      where: {
        status: {
          in: ["PAID", "ASSIGNED", "IN_PROGRESS", "COMPLETION_REQUESTED", "COMPLETED"],
        },
      },
      _sum: { totalPrice: true },
    }),
    prisma.settlement.aggregate({ _sum: { commissionAmount: true } }),
  ]);

  const gmv = gmvAgg._sum.totalPrice ?? 0;
  const commission = commissionAgg._sum.commissionAmount ?? 0;

  return (
    <div className="bg-[#f8f6ef] text-[#2d2d2d]">
      {/* 1. Hero */}
      <section className="bg-brand-900 px-6 py-16 text-center text-white sm:py-24">
        <p className="text-sm font-medium text-white/60">모두의농부 · 투자자 소개</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-2xl font-bold leading-snug sm:text-4xl">
          농민에게 필요한 모든 서비스를 하나로
        </h1>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {HERO_SERVICES.map((s) =>
            s.href ? (
              <Link
                key={s.label}
                href={s.href}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 px-4 py-6 transition hover:bg-white/20"
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="text-sm font-medium">{s.label}</span>
              </Link>
            ) : (
              <div
                key={s.label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 px-4 py-6 opacity-60"
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="text-sm font-medium">{s.label}</span>
                <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px]">준비중</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* 2. 실제 거래 현황 (실데이터) */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold sm:text-2xl">실제 거래가 일어나는 플랫폼입니다</h2>
          <p className="mt-2 text-sm text-black/50">
            아래는 연출된 예시가 아니라, 현재까지 플랫폼에 실제로 쌓인 데이터입니다.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard label="누적 방제 신청" value={`${reservationCount.toLocaleString("ko-KR")}건`} />
            <StatCard label="완료된 방제" value={`${completedCount.toLocaleString("ko-KR")}건`} />
            <StatCard label="누적 거래대금" value={formatPrice(gmv)} />
            <StatCard label="플랫폼 정산 수수료" value={formatPrice(commission)} />
            <StatCard label="가입 농민" value={`${farmerCount.toLocaleString("ko-KR")}명`} />
            <StatCard label="활동중인 방제사" value={`${approvedOperatorCount.toLocaleString("ko-KR")}명`} />
          </div>
        </div>
      </section>

      {/* 3. 서비스 확장 로드맵 */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-xl font-bold sm:text-2xl">서비스 확장</h2>
          <p className="mt-2 text-sm text-black/50">
            지금은 방제 하나지만, 앞으로 계속 확장됩니다.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5">
            {ROADMAP.map((r) => (
              <div key={r.label} className="flex flex-col items-center gap-2">
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-sm">
                  <Image
                    src={r.icon}
                    alt=""
                    width={64}
                    height={64}
                    className="h-full w-full rounded-full object-cover"
                  />
                </span>
                <span className="text-xs font-medium">{r.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    r.live
                      ? "bg-brand-100 text-brand-800"
                      : "bg-black/5 text-black/40"
                  }`}
                >
                  {r.live ? "운영중" : "준비중"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LTV 확장 구조 */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-xl font-bold sm:text-2xl">농민 한 명이 만드는 확장 구조</h2>
          <div className="mt-8 flex flex-col items-center">
            {["농민 1명", "방제", "위탁영농", "농약·비료", "농기계", "계약재배", "브랜드 쌀", "농산물 거래", "농업금융", "농업보험"].map(
              (step, i, arr) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="rounded-full bg-brand-700 px-5 py-2 text-sm font-medium text-white">
                    {step}
                  </div>
                  {i < arr.length - 1 && <div className="my-1.5 h-5 w-px bg-black/20" />}
                </div>
              )
            )}
            <div className="mt-3 rounded-xl bg-accent-100 px-5 py-3 text-sm font-bold text-accent-800">
              농민 Lifetime Value 증가
            </div>
          </div>
        </div>
      </section>

      {/* 5. 투자금 사용처 */}
      <section className="bg-brand-900 px-6 py-16 text-center text-white sm:py-24">
        <p className="mx-auto max-w-xl text-xl font-bold leading-snug sm:text-3xl">
          투자금은 앱을 만드는 데 쓰는 것이 아닙니다
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {USE_OF_FUNDS.map((item) => (
            <div key={item} className="rounded-xl bg-white/10 px-3 py-3 text-sm font-medium">
              {item}
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-xl text-sm leading-relaxed text-white/70">
          플랫폼은 이미 시작되었습니다. 투자금은 새로운 아이디어를 만드는 데 쓰는 것이 아니라,
          전국으로 확장하기 위한 인력과 운영 시스템을 구축하는 데 사용됩니다.
        </p>
      </section>

      {/* 6. 차별점 + 클로징 */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold sm:text-2xl">모두의농부의 가장 큰 강점</h2>
          <p className="mt-4 text-sm leading-relaxed text-black/60 sm:text-base">
            다른 농업 플랫폼은 농산물 거래나 농기계처럼 한 분야에서 시작하는 경우가 많습니다.
            반면 모두의농부는 실제 방제 사업과 위탁영농을 기반으로 고객을 확보한 뒤, 그 고객에게
            육묘·농약·비료·농기계·계약재배·브랜드 쌀·농업금융·농업보험까지 순차적으로 연결하는
            구조를 목표로 하고 있습니다.
          </p>
          <p className="mt-10 rounded-2xl bg-brand-50 px-6 py-8 text-base font-semibold leading-relaxed text-brand-900 sm:text-lg">
            &ldquo;우리는 앱을 만들려는 회사가 아니라, 농민 한 명이 평생 사용하는 농업 원스톱
            플랫폼을 만들려는 회사입니다. 앱은 그 플랫폼을 연결하는 출발점일 뿐입니다.&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-5 shadow-sm">
      <p className="text-lg font-bold sm:text-xl">{value}</p>
      <p className="mt-1 text-xs text-black/50">{label}</p>
    </div>
  );
}
