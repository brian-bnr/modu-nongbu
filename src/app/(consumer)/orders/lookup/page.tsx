import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  formatDate,
  formatPrice,
  REQUEST_STATUS_LABEL,
  REQUEST_STATUS_VARIANT,
} from "@/lib/format";

export default async function OrderLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; phone?: string }>;
}) {
  const { name, phone } = await searchParams;
  const searched = Boolean(name && phone);

  const requests = searched
    ? await prisma.purchaseRequest.findMany({
        where: { customerName: name, customerPhone: phone },
        orderBy: { createdAt: "desc" },
        include: { product: true, farm: true },
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">주문 조회</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        구매요청 시 입력한 이름과 연락처로 진행 상황을 확인할 수 있습니다.
      </p>

      <form method="get" className="mt-6 flex flex-wrap gap-2">
        <input
          type="text"
          name="name"
          defaultValue={name}
          placeholder="이름"
          className="w-40 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        <input
          type="text"
          name="phone"
          defaultValue={phone}
          placeholder="연락처 (010-0000-0000)"
          className="w-56 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          조회
        </button>
      </form>

      {searched && (
        <div className="mt-8">
          {requests.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              일치하는 구매요청 내역이 없습니다.
            </p>
          ) : (
            <ul className="space-y-3">
              {requests.map((request) => (
                <li
                  key={request.id}
                  className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/10"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">
                      {request.product.name} · {request.farm.name}
                    </p>
                    <Badge variant={REQUEST_STATUS_VARIANT[request.status]}>
                      {REQUEST_STATUS_LABEL[request.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-black/60 dark:text-white/60">
                    수량 {request.quantity} · 예상 금액{" "}
                    {formatPrice(request.product.price * request.quantity)}
                  </p>
                  <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                    요청번호 {request.id} · {formatDate(request.createdAt)}
                  </p>
                  {request.adminNote && (
                    <p className="mt-2 rounded-md bg-black/5 px-3 py-2 text-black/70 dark:bg-white/10 dark:text-white/70">
                      운영자 메모: {request.adminNote}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
