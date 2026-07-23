import Link from "next/link";
import type { DroneReservationStatus, DroneOperatorStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { ScrollReveal } from "@/components/ScrollReveal";
import { VisitTrendChart } from "@/components/admin/VisitTrendChart";
import { BarList, type BarListItem } from "@/components/admin/BarList";
import { PageIntro, StatTile, SectionHeader, SectionCard } from "@/components/admin/AdminUI";
import { requireAdmin } from "@/lib/auth";
import {
  formatDate,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_TYPE_LABEL,
  POST_TYPE_ICON,
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
  DRONE_OPERATOR_STATUS_LABEL,
  ROLE_LABEL,
} from "@/lib/format";

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

const ROLE_ORDER: Role[] = ["FARMER", "OPERATOR", "EXPERT", "COMPANY"];
const OPERATOR_STATUS_ORDER: DroneOperatorStatus[] = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];
const OPERATOR_STATUS_BAR_CLASS: Record<DroneOperatorStatus, string> = {
  PENDING: "bg-amber-500",
  APPROVED: "bg-brand-600",
  REJECTED: "bg-red-500",
  SUSPENDED: "bg-red-500",
};

const VARIANT_BAR_CLASS: Record<string, string> = {
  neutral: "bg-black/25 dark:bg-white/30",
  green: "bg-brand-600",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-600",
};

export default async function AdminDashboardPage() {
  await requireAdmin();

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
    roleRows,
    operatorStatusRows,
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
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.droneOperator.groupBy({ by: ["status"], _count: true }),
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

  const roleMap = new Map(roleRows.map((row) => [row.role, row._count]));
  const roleStats = ROLE_ORDER.map((r) => ({ role: r, count: roleMap.get(r) ?? 0 }));

  const operatorStatusMap = new Map(operatorStatusRows.map((row) => [row.status, row._count]));
  const operatorStatusItems: BarListItem[] = OPERATOR_STATUS_ORDER.map((s) => ({
    key: s,
    label: DRONE_OPERATOR_STATUS_LABEL[s],
    value: operatorStatusMap.get(s) ?? 0,
    colorClass: OPERATOR_STATUS_BAR_CLASS[s],
  }));

  return (
    <div>
      <PageIntro title="대시보드" subtitle={`실시간 현황 · ${formatDate(now)} 기준`} />

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
          color="accent"
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
        <h2 className="text-sm font-semibold text-black/60 dark:text-white/60">역할(모드)별 현황</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {roleStats.map(({ role, count }, i) => (
            <StatTile
              key={role}
              label={`${ROLE_LABEL[role]} 모드`}
              value={count}
              color={["blue", "teal", "amber", "indigo"][i] as "blue" | "teal" | "amber" | "indigo"}
              href="/admin/users"
              delay={i * 40}
            />
          ))}
        </div>
        <div className="mt-4">
          <SectionCard title="방제사 승인 현황" tone="teal" delay={0}>
            {operatorStatusItems.every((item) => item.value === 0) ? (
              <p className="text-sm text-black/50 dark:text-white/50">방제사 신청 내역이 없습니다.</p>
            ) : (
              <BarList items={operatorStatusItems} />
            )}
          </SectionCard>
        </div>
      </div>

      <div className="mt-8">
        <ScrollReveal className="overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
          <SectionHeader tone="blue">
            최근 14일 방문자 추이 (총 {periodVisitorTotal.toLocaleString("ko-KR")}명)
          </SectionHeader>
          <div className="bg-white p-4 dark:bg-white/5">
            <VisitTrendChart data={visitTrend} />
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="타입별 게시글 분포" tone="brand" delay={80}>
          {postTypeItems.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">등록된 글이 없습니다.</p>
          ) : (
            <BarList items={postTypeItems} />
          )}
        </SectionCard>

        <SectionCard title="드론 예약 상태별 현황" tone="teal" delay={140}>
          {droneStatusItems.every((item) => item.value === 0) ? (
            <p className="text-sm text-black/50 dark:text-white/50">드론 예약 내역이 없습니다.</p>
          ) : (
            <BarList items={droneStatusItems} />
          )}
        </SectionCard>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
        <SectionHeader tone="amber">최근 문의</SectionHeader>
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
