import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InquiryEditForm } from "@/components/InquiryEditForm";
import { updateInquiry } from "@/lib/actions/inquiry";

const QUANTITY_TYPES = new Set(["SELL_PRODUCT", "BUY_PRODUCT"]);

export default async function EditInquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect(`/login?callbackUrl=/my/inquiries/${id}/edit`);
  }

  const inquiry = await prisma.inquiry.findUnique({ where: { id }, include: { post: true } });
  if (!inquiry) {
    notFound();
  }
  if (inquiry.userId !== session.user.id) {
    redirect("/my/inquiries");
  }
  if (inquiry.status !== "REQUESTED") {
    redirect("/my/inquiries");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">문의 수정</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">{inquiry.post.title}</p>
      <div className="mt-6">
        <InquiryEditForm
          action={updateInquiry.bind(null, inquiry.id)}
          defaultMessage={inquiry.message ?? ""}
          defaultQuantity={inquiry.quantity ?? undefined}
          showQuantity={QUANTITY_TYPES.has(inquiry.post.postType)}
        />
      </div>
    </div>
  );
}
