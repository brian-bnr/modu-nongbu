import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

function maskName(name: string) {
  if (name.length <= 1) return `${name}*`;
  return `${name[0]}${"*".repeat(name.length - 1)}`;
}

export default async function DroneOperatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const operator = await prisma.droneOperator.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: { include: { farmer: true }, orderBy: { createdAt: "desc" } },
      reservations: { where: { status: "COMPLETED" } },
    },
  });

  if (!operator || operator.status !== "APPROVED") notFound();

  const completedCount = operator.reservations.length;
  const totalAreaPyeong = operator.reservations.reduce(
    (sum, r) => sum + (r.actualAreaPyeong ?? r.areaPyeong),
    0
  );
  const reviewCount = operator.reviews.length;
  const avgRating =
    reviewCount > 0 ? operator.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl">
            🧑‍✈️
          </div>
          <div>
            <h1 className="text-xl font-bold">{operator.user.name}</h1>
            <p className="text-sm text-black/50">{operator.user.region ?? "지역 미등록"}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/10 pt-4 text-center text-sm">
          <div>
            <p className="font-semibold">{completedCount}건</p>
            <p className="text-xs text-black/50">완료 작업</p>
          </div>
          <div>
            <p className="font-semibold">{totalAreaPyeong.toLocaleString("ko-KR")}평</p>
            <p className="text-xs text-black/50">누적 방제 면적</p>
          </div>
          <div>
            {avgRating != null ? (
              <p className="font-semibold text-amber-500">★ {avgRating.toFixed(1)}</p>
            ) : (
              <p className="font-semibold text-black/30">-</p>
            )}
            <p className="text-xs text-black/50">평점 ({reviewCount})</p>
          </div>
        </div>

        {operator.experienceYears != null && (
          <p className="mt-4 text-sm text-black/60">경력 {operator.experienceYears}년</p>
        )}
        {operator.equipmentInfo && (
          <p className="mt-2 whitespace-pre-line text-sm text-black/60">
            {operator.equipmentInfo}
          </p>
        )}

        <Link
          href="/drones/new"
          className="mt-6 block w-full rounded-md bg-brand-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-800"
        >
          방제 신청하기
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">리뷰 {reviewCount}건</h2>
        {reviewCount === 0 ? (
          <p className="mt-3 text-sm text-black/50">아직 리뷰가 없어요.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {operator.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-black/10 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-amber-500">
                    {"★".repeat(review.rating)}
                    <span className="text-black/20">{"★".repeat(5 - review.rating)}</span>
                  </p>
                  <p className="text-xs text-black/40">{formatDate(review.createdAt)}</p>
                </div>
                {review.comment && <p className="mt-2 text-black/70">{review.comment}</p>}
                <p className="mt-2 text-xs text-black/40">{maskName(review.farmer.name)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
