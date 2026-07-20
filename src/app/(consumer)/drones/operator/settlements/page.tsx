import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { SETTLEMENT_STATUS_LABEL, SETTLEMENT_STATUS_VARIANT, formatDate, formatPrice } from "@/lib/format";

export default async function OperatorSettlementsPage() {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect("/login?callbackUrl=/drones/operator/settlements");
  }

  const operator = await prisma.droneOperator.findUnique({ where: { userId: session.user.id } });
  if (!operator) {
    redirect("/drones/operator");
  }

  const settlements = await prisma.settlement.findMany({
    where: { operatorId: operator.id },
    orderBy: { createdAt: "desc" },
  });

  const totalPayout = settlements
    .filter((s) => s.status === "PAID")
    .reduce((sum, s) => sum + s.payoutAmount, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <Link
        href="/drones/operator"
        className="text-sm text-brand-700 hover:underline dark:text-brand-400"
      >
        ← 방제사 홈으로
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">정산 내역</h1>
        <p className="text-sm text-black/50 dark:text-white/50">
          누적 정산완료 {formatPrice(totalPayout)}
        </p>
      </div>

      {settlements.length === 0 ? (
        <p className="mt-6 text-sm text-black/50 dark:text-white/50">아직 정산 내역이 없습니다.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {settlements.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10"
            >
              <div>
                <p className="font-medium">{formatPrice(s.payoutAmount)}</p>
                <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                  거래액 {formatPrice(s.grossAmount)} · 수수료 {s.commissionRate}% ·{" "}
                  {formatDate(s.createdAt)}
                </p>
              </div>
              <Badge variant={SETTLEMENT_STATUS_VARIANT[s.status]}>
                {SETTLEMENT_STATUS_LABEL[s.status]}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
