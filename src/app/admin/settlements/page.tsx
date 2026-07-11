import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { SETTLEMENT_STATUS_LABEL, SETTLEMENT_STATUS_VARIANT, formatDate, formatPrice } from "@/lib/format";
import { markSettlementPaid } from "@/lib/actions/settlement";

export default async function AdminSettlementsPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [heldAgg, pendingCount, paidThisMonthAgg, pendingSettlements] = await Promise.all([
    prisma.payment.aggregate({ where: { status: "HELD" }, _sum: { amount: true } }),
    prisma.settlement.count({ where: { status: "PENDING" } }),
    prisma.settlement.aggregate({
      where: { status: "PAID", paidAt: { gte: monthStart } },
      _sum: { payoutAmount: true },
    }),
    prisma.settlement.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { operator: { include: { user: true } }, payment: { include: { reservation: true } } },
    }),
  ]);

  const statCards = [
    { label: "에스크로 보관 총액", value: formatPrice(heldAgg._sum.amount ?? 0) },
    { label: "정산 대기 건수", value: `${pendingCount}건` },
    { label: "이번달 정산 완료액", value: formatPrice(paidThisMonthAgg._sum.payoutAmount ?? 0) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">정산 관리</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-black/10 p-4 dark:border-white/10"
          >
            <p className="text-sm text-black/50 dark:text-white/50">{stat.label}</p>
            <p className="mt-1 text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">정산 대기 목록</h2>
      {pendingSettlements.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">정산 대기 중인 건이 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {pendingSettlements.map((settlement) => (
            <li
              key={settlement.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10"
            >
              <div className="text-sm">
                <p className="font-medium">
                  {settlement.operator.user.name} · {settlement.payment.reservation.cropType} (
                  {settlement.payment.reservation.areaPyeong}평)
                </p>
                <p className="mt-1 text-black/60 dark:text-white/60">
                  결제 {formatPrice(settlement.grossAmount)} − 수수료 {settlement.commissionRate}% (
                  {formatPrice(settlement.commissionAmount)}) = 지급액{" "}
                  <span className="font-medium">{formatPrice(settlement.payoutAmount)}</span>
                </p>
                <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                  {formatDate(settlement.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={SETTLEMENT_STATUS_VARIANT[settlement.status]}>
                  {SETTLEMENT_STATUS_LABEL[settlement.status]}
                </Badge>
                <form action={markSettlementPaid.bind(null, settlement.id)}>
                  <button
                    type="submit"
                    className="rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800"
                  >
                    이체 완료 처리
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
