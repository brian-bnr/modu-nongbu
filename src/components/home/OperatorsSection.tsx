import Link from "next/link";
import { OperatorCard } from "@/components/OperatorCard";
import type { OperatorCardData } from "@/components/OperatorCard";

export function OperatorsSection({ operators }: { operators: OperatorCardData[] }) {
  if (operators.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 p-6 text-center sm:p-8">
        <p className="text-sm font-semibold text-foreground">
          아직 활동 중인 방제사가 없어요
        </p>
        <p className="mt-1 text-xs text-black/50 sm:text-sm">
          방제사로 등록하고 가장 먼저 이름을 올려보세요.
        </p>
        <Link
          href="/drones/operator"
          className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline"
        >
          방제사 지원하기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {operators.map((op) => (
        <div key={op.id} className="w-64 shrink-0 snap-start sm:w-auto">
          <OperatorCard operator={op} />
        </div>
      ))}
    </div>
  );
}
