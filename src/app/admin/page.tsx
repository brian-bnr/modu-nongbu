import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  formatDate,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_TYPE_LABEL,
} from "@/lib/format";

export default async function AdminDashboardPage() {
  const [userCount, postCount, newInquiryCount, postsByType, recentInquiries] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.inquiry.count({ where: { status: "REQUESTED" } }),
    prisma.post.groupBy({ by: ["postType"], _count: true }),
    prisma.inquiry.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { post: true, user: true },
    }),
  ]);

  const statCards = [
    {
      href: "/admin/inquiries?status=REQUESTED",
      icon: "📩",
      label: "신규 문의",
      value: newInquiryCount,
      accent: "bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-200",
    },
    {
      href: "/admin/users",
      icon: "👤",
      label: "가입 회원",
      value: userCount,
      accent: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      href: "/admin/posts",
      icon: "📝",
      label: "등록된 글",
      value: postCount,
      accent: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">대시보드</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {statCards.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="group flex items-center gap-3 rounded-xl border border-black/10 p-3 transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-md dark:border-white/10"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${stat.accent}`}
            >
              {stat.icon}
            </span>
            <p className="flex-1 text-sm text-black/50 dark:text-white/50">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
            <span className="text-black/20 transition group-hover:translate-x-0.5 group-hover:text-black/40 dark:text-white/20 dark:group-hover:text-white/40">
              →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">타입별 게시글 분포</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
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

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">최근 문의</h2>
        <Link href="/admin/inquiries" className="text-sm text-brand-700 hover:underline dark:text-brand-400">
          전체 보기 →
        </Link>
      </div>
      {recentInquiries.length === 0 ? (
        <p className="mt-4 text-sm text-black/50 dark:text-white/50">
          아직 접수된 문의가 없습니다.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {recentInquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/admin/inquiries/${inquiry.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
                <div>
                  <p className="font-medium">
                    {inquiry.user.name} · {inquiry.post.title}
                  </p>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>
                  {INQUIRY_STATUS_LABEL[inquiry.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
