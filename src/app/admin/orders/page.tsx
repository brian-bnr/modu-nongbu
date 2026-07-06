import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  formatDate,
  REQUEST_STATUS_LABEL,
  REQUEST_STATUS_VARIANT,
} from "@/lib/format";
import type { RequestStatus } from "@prisma/client";

const STATUS_OPTIONS: RequestStatus[] = [
  "REQUESTED",
  "CONFIRMED",
  "PAYMENT_PENDING",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const isValidStatus = status && STATUS_OPTIONS.includes(status as RequestStatus);

  const requests = await prisma.purchaseRequest.findMany({
    where: isValidStatus ? { status: status as RequestStatus } : {},
    orderBy: { createdAt: "desc" },
    include: { product: true, farm: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">구매요청 관리</h1>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1 ${
            !isValidStatus ? "bg-brand-700 text-white" : "bg-black/5 dark:bg-white/10"
          }`}
        >
          전체
        </Link>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full px-3 py-1 ${
              status === s ? "bg-brand-700 text-white" : "bg-black/5 dark:bg-white/10"
            }`}
          >
            {REQUEST_STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      {requests.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">
          해당 조건의 구매요청이 없습니다.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/50 dark:border-white/10 dark:text-white/50">
              <tr>
                <th className="py-2 pr-4">요청일시</th>
                <th className="py-2 pr-4">고객</th>
                <th className="py-2 pr-4">농산물</th>
                <th className="py-2 pr-4">농가</th>
                <th className="py-2 pr-4">수량</th>
                <th className="py-2 pr-4">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="py-2 pr-4 whitespace-nowrap">{formatDate(request.createdAt)}</td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/orders/${request.id}`}
                      className="font-medium text-brand-700 hover:underline dark:text-brand-400"
                    >
                      {request.customerName}
                    </Link>
                    <p className="text-xs text-black/40 dark:text-white/40">
                      {request.customerPhone}
                    </p>
                  </td>
                  <td className="py-2 pr-4">{request.product.name}</td>
                  <td className="py-2 pr-4">{request.farm.name}</td>
                  <td className="py-2 pr-4">{request.quantity}</td>
                  <td className="py-2 pr-4">
                    <Badge variant={REQUEST_STATUS_VARIANT[request.status]}>
                      {REQUEST_STATUS_LABEL[request.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
