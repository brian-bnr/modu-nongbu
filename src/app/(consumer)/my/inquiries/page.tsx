import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_TYPE_LABEL,
  formatDate,
} from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);

export default async function MyInquiriesPage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/inquiries");
  }

  const inquiries = await prisma.inquiry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { post: true },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">내 문의내역</h1>

      {inquiries.length === 0 ? (
        <p className="mt-6 text-sm text-black/50 dark:text-white/50">아직 보낸 문의가 없습니다.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {inquiries.map((inquiry) => {
            const base = JOB_TYPES.has(inquiry.post.postType) ? "/jobs" : "/products";
            return (
              <li
                key={inquiry.id}
                className="rounded-lg border border-black/10 p-4 dark:border-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      {POST_TYPE_LABEL[inquiry.post.postType]} · {formatDate(inquiry.createdAt)}
                    </p>
                    <Link
                      href={`${base}/${inquiry.post.id}`}
                      className="mt-1 block font-medium hover:underline"
                    >
                      {inquiry.post.title}
                    </Link>
                    {inquiry.message && (
                      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                        {inquiry.message}
                      </p>
                    )}
                  </div>
                  <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>
                    {INQUIRY_STATUS_LABEL[inquiry.status]}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
