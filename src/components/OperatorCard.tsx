import Link from "next/link";

export type OperatorCardData = {
  id: string;
  name: string;
  region: string | null;
  experienceYears: number | null;
  totalAreaPyeong: number;
  completedCount: number;
  avgRating: number | null;
  reviewCount: number;
  sample?: boolean;
  photoUrl?: string;
  photoPosition?: string;
  equipmentInfo?: string;
};

export function OperatorCard({ operator }: { operator: OperatorCardData }) {
  return (
    <Link
      href={`/drones/operators/${operator.id}`}
      className="block shrink-0 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        {operator.photoUrl ? (
          <img
            src={operator.photoUrl}
            alt=""
            style={{ objectPosition: operator.photoPosition ?? "center" }}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-2xl">
            🧑‍✈️
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{operator.name}</p>
          <p className="truncate text-xs text-black/50">{operator.region ?? "지역 미등록"}</p>
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
