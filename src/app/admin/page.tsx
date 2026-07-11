import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  formatDate,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_TYPE_LABEL,
} from "@/lib/format";

const HEADER_COLORS = {
  green: "bg-brand-700",
  amber: "bg-amber-600",
  blue: "bg-blue-700",
  purple: "bg-purple-700",
  red: "bg-red-700",
} as const;

function StatTile({
  label,
  value,
  color,
  href,
}: {
  label: string;
  value: number;
  color: keyof typeof HEADER_COLORS;
  href?: string;
}) {
  const body = (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
      <div
        className={`px-2 py-2 text-center text-xs font-medium text-white sm:text-sm ${HEADER_COLORS[color]}`}
      >
        {label}
      </div>
      <div className="px-3 py-4 text-center text-2xl font-bold sm:py-6 sm:text-4xl">{value}</div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-t-lg bg-red-700 px-4 py-2.5 text-center text-sm font-semibold text-white">
      {children}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

  const [
    userCount,
    postCount,
    newInquiryCount,
    todayVisitorCount,
    postsByType,
    recentInquiries,
    pendingDroneCount,
    pendingSettlementCount,
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
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">대시보드</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile label="오늘 방문자" value={todayVisitorCount} color="purple" />
        <StatTile
          label="신규 문의"
          value={newInquiryCount}
          color="amber"
          href="/admin/inquiries?status=REQUESTED"
        />
        <StatTile label="가입 회원" value={userCount} color="blue" href="/admin/users" />
        <StatTile label="등록된 글" value={postCount} color="green" href="/admin/posts" />
        <StatTile
          label="진행중 드론 예약"
          value={pendingDroneCount}
          color="green"
          href="/admin/drones"
        />
        <StatTile
          label="정산 대기"
          value={pendingSettlementCount}
          color="red"
          href="/admin/settlements"
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
        <SectionHeader>타입별 게시글 분포</SectionHeader>
        <div className="flex flex-wrap gap-2 bg-white p-4 text-sm dark:bg-white/5">
          {postsByType.map((row) => (
            <span
              key={row.postType}
              className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10"
            >
              {POST_TYPE_LABEL[row.postType]} {row._count}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
        <SectionHeader>최근 문의</SectionHeader>
        {recentInquiries.length === 0 ? (
          <p className="bg-white p-4 text-sm text-black/50 dark:bg-white/5 dark:text-white/50">
            아직 접수된 문의가 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-white/5">
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
                {recentInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] dark:border-white/5 dark:hover:bg-white/[0.03]"
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
