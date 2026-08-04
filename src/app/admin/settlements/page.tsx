import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { PageIntro, StatTile, SectionCard } from "@/components/admin/AdminUI";
import { requireAdmin } from "@/lib/auth";
import { SETTLEMENT_STATUS_LABEL, SETTLEMENT_STATUS_VARIANT, formatDate, formatPrice } from "@/lib/format";
import { markSettlementPaid } from "@/lib/actions/settlement";

export default async function AdminSettlementsPage() {
  await requireAdmin();

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

  return (
    <div>
      <PageIntro title="정산 관리" subtitle={`정산 대기 ${pendingCount.toLocaleString("ko-KR")}건`} />

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatTile
          label="에스크로 보관 총액"
          value={heldAgg._sum.amount ?? 0}
          color="indigo"
          unit="원"
          delay={0}
        />
        <StatTile label="정산 대기 건수" value={pendingCount} color="accent" unit="건" delay={40} />
        <StatTile
          label="이번달 정산완료액"
          value={paidThisMonthAgg._sum.payoutAmount ?? 0}
          color="emerald"
          unit="원"
          delay={80}
        />
      </div>

      <div className="mt-6">
        <SectionCard title="정산 대기 목록" tone="accent" delay={120}>
          {pendingSettlements.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">정산 대기 중인 건이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {pendingSettlements.map((settlement, i) => (
                <li
                  key={settlement.id}
                  className="animate-fade-in-up flex flex-wrap items-center justify-between gap-4 rounded-lg border border-black/10 p-4 transition duration-300 hover:shadow-md dark:border-white/10"
                  style={{ animationDelay: `${i * 40}ms` }}
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
        </SectionCard>
      </div>
    </div>
  );
}
