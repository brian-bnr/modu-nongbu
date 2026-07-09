import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InquiryStatusForm } from "@/components/InquiryStatusForm";
import { formatDate, POST_TYPE_LABEL } from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { post: true, user: true },
  });

  if (!inquiry) {
    notFound();
  }

  const basePath = JOB_TYPES.has(inquiry.post.postType) ? "/jobs" : "/products";

  return (
    <div>
      <Link
        href="/admin/inquiries"
        className="text-sm text-brand-700 hover:underline dark:text-brand-400"
      >
        ← 문의 목록으로
      </Link>
      <h1 className="mt-2 text-2xl font-bold">문의 상세</h1>

      <div className="mt-4 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <p>
          게시글:{" "}
          <Link
            href={`${basePath}/${inquiry.post.id}`}
            className="text-brand-700 hover:underline dark:text-brand-400"
          >
            {inquiry.post.title}
          </Link>{" "}
          ({POST_TYPE_LABEL[inquiry.post.postType]})
        </p>
        <p className="mt-1">
          문의자: {inquiry.user.name} ({inquiry.user.email} · {inquiry.user.phone})
        </p>
        {inquiry.quantity != null && <p className="mt-1">수량: {inquiry.quantity}</p>}
        {inquiry.message && <p className="mt-2 whitespace-pre-line">{inquiry.message}</p>}
        <p className="mt-2 text-xs text-black/40 dark:text-white/40">
          {formatDate(inquiry.createdAt)} 접수
        </p>
      </div>

      <div className="mt-6 max-w-lg">
        <InquiryStatusForm inquiry={inquiry} />
      </div>
    </div>
  );
}
