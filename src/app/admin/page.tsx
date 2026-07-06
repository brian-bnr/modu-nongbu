import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { formatDate, REQUEST_STATUS_LABEL, REQUEST_STATUS_VARIANT } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [newRequestCount, farmCount, productCount, recentRequests] = await Promise.all([
    prisma.purchaseRequest.count({ where: { status: "REQUESTED" } }),
    prisma.farm.count(),
    prisma.product.count(),
    prisma.purchaseRequest.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { product: true, farm: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">대시보드</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-black/50 dark:text-white/50">신규 구매요청</p>
          <p className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-400">
            {newRequestCount}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-black/50 dark:text-white/50">등록된 농가</p>
          <p className="mt-1 text-2xl font-bold">{farmCount}</p>
        </div>
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-black/50 dark:text-white/50">등록된 농산물</p>
          <p className="mt-1 text-2xl font-bold">{productCount}</p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold">최근 구매요청</h2>
        <Link href="/admin/orders" className="text-sm text-brand-700 hover:underline dark:text-brand-400">
          전체 보기 →
        </Link>
      </div>
      {recentRequests.length === 0 ? (
        <p className="mt-4 text-sm text-black/50 dark:text-white/50">
          아직 접수된 구매요청이 없습니다.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {recentRequests.map((request) => (
            <li key={request.id}>
              <Link
                href={`/admin/orders/${request.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
                <div>
                  <p className="font-medium">
                    {request.customerName} · {request.product.name} ({request.farm.name})
                  </p>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
                <Badge variant={REQUEST_STATUS_VARIANT[request.status]}>
                  {REQUEST_STATUS_LABEL[request.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
