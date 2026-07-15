import { prisma } from "@/lib/prisma";
import type { OperatorCardData } from "@/components/OperatorCard";

export type OperatorWithStats = Awaited<ReturnType<typeof getApprovedOperatorsWithStats>>[number];

export function toOperatorCardData(op: OperatorWithStats): OperatorCardData {
  return {
    id: op.id,
    name: op.user.name,
    region: op.user.region,
    experienceYears: op.experienceYears,
    totalAreaPyeong: op.totalAreaPyeong,
    completedCount: op.completedCount,
    avgRating: op.avgRating,
    reviewCount: op.reviewCount,
    photoUrl: op.user.image ?? undefined,
  };
}

export async function getApprovedOperatorsWithStats() {
  const operators = await prisma.droneOperator.findMany({
    where: { status: "APPROVED" },
    include: {
      user: true,
      reviews: true,
      reservations: { where: { status: "COMPLETED" } },
    },
  });

  const withStats = operators.map((op) => {
    const completedCount = op.reservations.length;
    const totalAreaPyeong = op.reservations.reduce(
      (sum, r) => sum + (r.actualAreaPyeong ?? r.areaPyeong),
      0
    );
    const reviewCount = op.reviews.length;
    const avgRating =
      reviewCount > 0 ? op.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : null;

    return { ...op, completedCount, totalAreaPyeong, reviewCount, avgRating };
  });

  withStats.sort((a, b) => {
    if (a.avgRating != null && b.avgRating != null && a.avgRating !== b.avgRating) {
      return b.avgRating - a.avgRating;
    }
    if (a.avgRating != null && b.avgRating == null) return -1;
    if (a.avgRating == null && b.avgRating != null) return 1;
    return b.completedCount - a.completedCount;
  });

  return withStats;
}
