import Link from "next/link";
import type { DroneReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedNumber } from "@/components/admin/AnimatedNumber";
import { VisitTrendChart } from "@/components/admin/VisitTrendChart";
import { BarList, type BarListItem } from "@/components/admin/BarList";
import {
  formatDate,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_TYPE_LABEL,
  POST_TYPE_ICON,
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
} from "@/lib/format";

const TILE_STYLES = {
  purple: { header: "bg-gradient-to-br from-purple-600 to-purple-800", icon: "👀" },
  amber: { header: "bg-gradient-to-br from-amber-500 to-amber-700", icon: "💬" },
  blue: { header: "bg-gradient-to-br from-blue-600 to-blue-800", icon: "👥" },
  green: { header: "bg-gradient-to-br from-brand-500 to-brand-700", icon: "📝" },
  teal: { header: "bg-gradient-to-br from-teal-500 to-teal-700", icon: "🚁" },
  red: { header: "bg-gradient-to-br from-red-600 to-red-800", icon: "💰" },
  indigo: { header: "bg-gradient-to-br from-indigo-600 to-indigo-800", icon: "🔒" },
  emerald: { header: "bg-gradient-to-br from-emerald-500 to-emerald-700", icon: "✅" },
} as const;

const DRONE_STATUS_ORDER: DroneReservationStatus[] = [
  "REQUESTED",
  "PAID",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETION_REQUESTED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
];

const VARIANT_BAR_CLASS: Record<string, string> = {
  neutral: "bg-black/25 dark:bg-white/30",
  green: "bg-brand-600",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-600",
};

const QUICK_LINKS = [
  { href: "/admin/posts", label: "게시글 관리", icon: "📝", color: "bg-brand-50 dark:bg-brand-900/20" },
  { href: "/admin/inquiries", label: "문의 관리", icon: "💬", color: "bg-amber-50 dark:bg-amber-900/20" },
  { href: "/admin/users", label: "회원 관리", icon: "👥", color: "bg-blue-50 dark:bg-blue-900/20" },
  { href: "/admin/drones", label: "드론 예약 관리", icon: "🚁", color: "bg-teal-50 dark:bg-teal-900/20" },
  { href: "/admin/settlements", label: "정산 관리", icon: "💰", color: "bg-red-50 dark:bg-red-900/20" },
  { href: "/admin/settings", label: "설정", icon: "⚙️", color: "bg-black/5 dark:bg-white/10" },
];

function StatTile({
  label,
  value,
  color,
  href,
  unit,
  delay = 0,
}: {
  label: string;
  value: number;
  color: keyof typeof TILE_STYLES;
  href?: string;
  unit?: string;
  delay?: number;
}) {
  const style = TILE_STYLES[color];
  const body = (
    <div className="group h-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
      <div
        className={`flex items-center justify-between px-3 py-2 text-xs font-medium text-white sm:text-sm ${style.header}`}
      >
        <span>{label}</span>
        <span className="text-sm opacity-90 transition-transform duration-300 group-hover:scale-125">
          {style.icon}
        </span>
      </div>
      <div className="px-3 py-4 text-center text-2xl font-bold sm:py-6 sm:text-4xl">
        <AnimatedNumber value={value} unit={unit} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      {href ? (
        <Link href={href} className="block h-full">
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-t-lg bg-gradient-to-r from-red-700 to-red-800 px-4 py-2.5 text-center text-sm font-semibold text-white">
      {children}
    </div>
  );
}

function SectionCard({
  title,
  delay = 0,
  children,
}: {
  title: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <ScrollReveal delay={delay} className="overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
      <SectionHeader>{title}</SectionHeader>
      <div className="bg-white p-4 dark:bg-white/5">{children}</div>
    </ScrollReveal>
  );
}

export default async function AdminDashboardPage() {
  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
  });

  const [
    userCount,
    postCount,
    newInquiryCount,
    todayVisitorCount,
    postsByType,
    recentInquiries,
    pendingDroneCount,
    pendingSettlementCount,
    droneStatusRows,
    visitRows,
    heldAgg,
    paidThisMonthAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.inquiry.count({ where: { status: "REQUESTED" } }),
    prisma.visit.count({ where: { visitDate: todayStr } }),
    prisma.post.groupBy({ by: ["postType"], _count: true }),
    prisma.inquiry.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { post: true, user: true },
    }),
    prisma.droneReservation.count({
      where: { status: { in: ["REQUESTED", "PAID", "ASSIGNED", "IN_PROGRESS"] } },
    }),
    prisma.settlement.count({ where: { status: "PENDING" } }),
    prisma.droneReservation.groupBy({ by: ["status"], _count: true }),
    prisma.visit.groupBy({
      by: ["visitDate"],
      _count: true,
      where: { visitDate: { in: last14Days } },
    }),
    prisma.payment.aggregate({ where: { status: "HELD" }, _sum: { amount: true } }),
    prisma.settlement.aggregate({
      where: { status: "PAID", paidAt: { gte: monthStart } },
      _sum: { payoutAmount: true },
    }),
  ]);

  const visitMap = new Map(visitRows.map((row) => [row.visitDate, row._count]));
  const visitTrend = last14Days.map((date) => ({ date, count: visitMap.get(date) ?? 0 }));
  const periodVisitorTotal = visitTrend.reduce((sum, d) => sum + d.count, 0);

  const postTypeItems: BarListItem[] = postsByType
    .map((row) => ({
      key: row.postType,
      label: POST_TYPE_LABEL[row.postType],
      value: row._count,
      icon: POST_TYPE_ICON[row.postType],
    }))
    .sort((a, b) => b.value - a.value);

  const droneStatusMap = new Map(droneStatusRows.map((row) => [row.status, row._count]));
  const droneStatusItems: BarListItem[] = DRONE_STATUS_ORDER.map((s) => ({
    key: s,
    label: DRONE_RESERVATION_STATUS_LABEL[s],
    value: droneStatusMap.get(s) ?? 0,
    colorClass: VARIANT_BAR_CLASS[DRONE_RESERVATION_STATUS_VARIANT[s]],
  }));

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
          </span>
          실시간 현황 · {formatDate(now)} 기준
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1.5 rounded-lg border border-black/5 ${link.color} px-2 py-3 text-center text-xs font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="leading-tight">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile label="오늘 방문자" value={todayVisitorCount} color="purple" delay={0} />
        <StatTile
          label="신규 문의"
          value={newInquiryCount}
          color="amber"
          href="/admin/inquiries?status=REQUESTED"
          delay={40}
        />
        <StatTile label="가입 회원" value={userCount} color="blue" href="/admin/users" delay={80} />
        <StatTile label="등록된 글" value={postCount} color="green" href="/admin/posts" delay={120} />
        <StatTile
          label="진행중 드론 예약"
          value={pendingDroneCount}
          color="teal"
          href="/admin/drones"
          delay={160}
        />
        <StatTile
          label="정산 대기"
          value={pendingSettlementCount}
          color="red"
          href="/admin/settlements"
          delay={200}
        />
        <StatTile
          label="에스크로 보관 총액"
          value={heldAgg._sum.amount ?? 0}
          color="indigo"
          href="/admin/settlements"
          unit="원"
          delay={240}
        />
        <StatTile
          label="이번달 정산완료액"
          value={paidThisMonthAgg._sum.payoutAmount ?? 0}
          color="emerald"
          href="/admin/settlements"
          unit="원"
          delay={280}
        />
      </div>

      <div className="mt-8">
        <ScrollReveal className="overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
          <SectionHeader>최근 14일 방문자 추이 (총 {periodVisitorTotal.toLocaleString("ko-KR")}명)</SectionHeader>
          <div className="bg-white p-4 dark:bg-white/5">
            <VisitTrendChart data={visitTrend} />
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="타입별 게시글 분포" delay={80}>
          {postTypeItems.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">등록된 글이 없습니다.</p>
          ) : (
            <BarList items={postTypeItems} />
          )}
        </SectionCard>

        <SectionCard title="드론 예약 상태별 현황" delay={140}>
          {droneStatusItems.every((item) => item.value === 0) ? (
            <p className="text-sm text-black/50 dark:text-white/50">드론 예약 내역이 없습니다.</p>
          ) : (
            <BarList items={droneStatusItems} />
          )}
        </SectionCard>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
        <SectionHeader>최근 문의</SectionHeader>
        {recentInquiries.length === 0 ? (
          <p className="bg-white p-4 text-sm text-black/50 dark:bg-white/5 dark:text-white/50">
            아직 접수된 문의가 없습니다.
          </p>
        ) : (
          <div className="min-w-0 overflow-x-auto bg-white dark:bg-white/5">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs text-black/50 dark:border-white/10 dark:text-white/50">
                  <th className="px-4 py-2 font-medium">문의자</th>
                  <th className="px-4 py-2 font-medium">게시글</th>
                  <th className="px-4 py-2 font-medium">상태</th>
                  <th className="px-4 py-2 font-medium">접수일</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inquiry, i) => (
                  <tr
                    key={inquiry.id}
                    className="animate-fade-in-up border-b border-black/5 last:border-0 hover:bg-black/[0.02] dark:border-white/5 dark:hover:bg-white/[0.03]"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="text-brand-700 hover:underline dark:text-brand-400"
                      >
                        {inquiry.user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">{inquiry.post.title}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>
                        {INQUIRY_STATUS_LABEL[inquiry.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-black/50 dark:text-white/50">
                      {formatDate(inquiry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-black/10 bg-white px-4 py-2 text-right dark:border-white/10 dark:bg-white/5">
          <Link
            href="/admin/inquiries"
            className="text-sm text-brand-700 hover:underline dark:text-brand-400"
          >
            전체 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
