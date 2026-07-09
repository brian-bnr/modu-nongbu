import Link from "next/link";
import type { InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { formatDate, INQUIRY_STATUS_LABEL, INQUIRY_STATUS_VARIANT } from "@/lib/format";

const STATUS_OPTIONS: InquiryStatus[] = ["REQUESTED", "ACCEPTED", "COMPLETED", "CANCELLED"];

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus =
    status && STATUS_OPTIONS.includes(status as InquiryStatus) ? (status as InquiryStatus) : undefined;

  const inquiries = await prisma.inquiry.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { post: true, user: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">문의 관리</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/inquiries"
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
            !activeStatus
              ? "bg-brand-700 text-white"
              : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
          }`}
        >
          전체
        </Link>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/inquiries?status=${s}`}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
              activeStatus === s
                ? "bg-brand-700 text-white"
                : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
            }`}
          >
            {INQUIRY_STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">해당하는 문의가 없습니다.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/admin/inquiries/${inquiry.id}`}
                className="flex h-full flex-col justify-between gap-2 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
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
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
