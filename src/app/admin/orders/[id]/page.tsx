import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatusForm } from "@/components/OrderStatusForm";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.purchaseRequest.findUnique({
    where: { id },
    include: { product: true, farm: true },
  });

  if (!request) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">구매요청 상세</h1>
      <p className="mt-1 text-sm text-black/40 dark:text-white/40">요청번호 {request.id}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
            <p className="font-medium">고객 정보</p>
            <p className="mt-2">{request.customerName}</p>
            <p className="text-black/60 dark:text-white/60">{request.customerPhone}</p>
            {request.customerEmail && (
              <p className="text-black/60 dark:text-white/60">{request.customerEmail}</p>
            )}
          </div>

          <div className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
            <p className="font-medium">요청 내용</p>
            <p className="mt-2">
              <Link
                href={`/admin/products/${request.product.id}/edit`}
                className="text-brand-700 hover:underline dark:text-brand-400"
              >
                {request.product.name}
              </Link>{" "}
              · {request.farm.name}
            </p>
            <p className="mt-1 text-black/60 dark:text-white/60">
              수량 {request.quantity} · 예상 금액{" "}
              {formatPrice(request.product.price * request.quantity)}
            </p>
            {request.message && (
              <p className="mt-3 rounded-md bg-black/5 px-3 py-2 text-black/70 dark:bg-white/10 dark:text-white/70">
                {request.message}
              </p>
            )}
            <p className="mt-3 text-xs text-black/40 dark:text-white/40">
              접수일시 {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <p className="font-medium">상태 관리</p>
          <div className="mt-3">
            <OrderStatusForm request={request} />
          </div>
        </div>
      </div>
    </div>
  );
}
