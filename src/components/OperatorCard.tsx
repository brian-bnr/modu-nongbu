import Link from "next/link";
import type { OperatorWithStats } from "@/lib/droneOperatorStats";

export function OperatorCard({ operator }: { operator: OperatorWithStats }) {
  return (
    <Link
      href={`/drones/operators/${operator.id}`}
      className="block shrink-0 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl">
          🧑‍✈️
        </div>
        <div>
          <p className="font-semibold">{operator.user.name}</p>
          <p className="text-xs text-black/50">{operator.user.region ?? "지역 미등록"}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-black/60">
        {operator.experienceYears != null && <span>경력 {operator.experienceYears}년</span>}
        <span>누적 방제 {operator.totalAreaPyeong.toLocaleString("ko-KR")}평</span>
        <span>완료 {operator.completedCount}건</span>
      </div>
      <p className="mt-2 text-sm">
        {operator.avgRating != null ? (
          <>
            <span className="font-semibold text-amber-500">★ {operator.avgRating.toFixed(1)}</span>
            <span className="ml-1 text-black/40">({operator.reviewCount})</span>
          </>
        ) : (
          <span className="text-black/40">아직 리뷰가 없어요</span>
        )}
      </p>
    </Link>
  );
}
