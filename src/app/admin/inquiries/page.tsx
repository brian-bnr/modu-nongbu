import type { InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { PageIntro, StatTile, SectionCard, GridCard, FilterPill } from "@/components/admin/AdminUI";
import { requireAdmin } from "@/lib/auth";
import { formatDate, INQUIRY_STATUS_LABEL, INQUIRY_STATUS_VARIANT } from "@/lib/format";

const STATUS_OPTIONS: InquiryStatus[] = ["REQUESTED", "ACCEPTED", "COMPLETED", "CANCELLED"];

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const { status } = await searchParams;
  const activeStatus =
    status && STATUS_OPTIONS.includes(status as InquiryStatus) ? (status as InquiryStatus) : undefined;

  const [inquiries, totalCount, requestedCount, acceptedCount, completedCount] = await Promise.all([
    prisma.inquiry.findMany({
      where: activeStatus ? { status: activeStatus } : undefined,
      orderBy: { createdAt: "desc" },
      include: { post: true, user: true },
    }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "REQUESTED" } }),
    prisma.inquiry.count({ where: { status: "ACCEPTED" } }),
    prisma.inquiry.count({ where: { status: "COMPLETED" } }),
  ]);

  return (
    <div>
      <PageIntro title="문의 관리" subtitle={`전체 ${totalCount.toLocaleString("ko-KR")}건`} />

      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
        <StatTile label="전체 문의" value={totalCount} color="amber" delay={0} />
        <StatTile label="요청 접수" value={requestedCount} color="purple" delay={40} />
        <StatTile label="수락됨" value={acceptedCount} color="blue" delay={80} />
        <StatTile label="완료" value={completedCount} color="green" delay={120} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterPill href="/admin/inquiries" active={!activeStatus}>
          전체
        </FilterPill>
        {STATUS_OPTIONS.map((s) => (
          <FilterPill key={s} href={`/admin/inquiries?status=${s}`} active={activeStatus === s}>
            {INQUIRY_STATUS_LABEL[s]}
          </FilterPill>
        ))}
      </div>

      <div className="mt-6">
        <SectionCard title="문의 목록" tone="amber" delay={80}>
          {inquiries.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">해당하는 문의가 없습니다.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {inquiries.map((inquiry, i) => (
                <GridCard key={inquiry.id} href={`/admin/inquiries/${inquiry.id}`} delay={i * 30}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{inquiry.post.title}</p>
                    <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>
                      {INQUIRY_STATUS_LABEL[inquiry.status]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">{inquiry.user.name}</p>
                    <p className="mt-0.5 text-xs text-black/40 dark:text-white/40">
                      {formatDate(inquiry.createdAt)}
                    </p>
                  </div>
                </GridCard>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
