import Link from "next/link";
import { getApprovedOperatorsWithStats, toOperatorCardData } from "@/lib/droneOperatorStats";
import { OperatorCard } from "@/components/OperatorCard";
import { SAMPLE_OPERATORS } from "@/lib/sampleOperators";

export default async function DroneOperatorsPage() {
  const realOperators = await getApprovedOperatorsWithStats();
  const operators =
    realOperators.length > 0 ? realOperators.map(toOperatorCardData) : SAMPLE_OPERATORS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">내 주변 방제사</h1>
          <p className="mt-1 text-sm text-black/50">
            등록된 방제사의 경력과 방제 이력을 확인하고 예약해보세요.
          </p>
        </div>
        <Link
          href="/drones/new"
          className="shrink-0 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          방제 신청하기
        </Link>
      </div>

      {operators.length === 0 ? (
        <p className="mt-8 text-sm text-black/50">아직 등록된 방제사가 없어요.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {operators.map((op) => (
            <OperatorCard key={op.id} operator={op} />
          ))}
        </div>
      )}
    </div>
  );
}
