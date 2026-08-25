import { prisma } from "@/lib/prisma";
import { getApprovedOperatorsWithStats, toOperatorCardData } from "@/lib/droneOperatorStats";
import { SAMPLE_OPERATORS } from "@/lib/sampleOperators";

export async function getHomeData(sevenDaysAgoISO: string) {
  const sevenDaysAgo = new Date(sevenDaysAgoISO);

  const [recentPosts, popularPool, operators, farmerCount, completedDroneCount, weeklyPostCount] =
    await Promise.all([
      prisma.post.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { author: true },
      }),
      prisma.post.findMany({
        take: 30,
        where: { status: "OPEN" },
        orderBy: [{ inquiries: { _count: "desc" } }, { createdAt: "desc" }],
        include: { author: true, _count: { select: { inquiries: true } } },
      }),
      getApprovedOperatorsWithStats(),
      prisma.user.count({ where: { role: "FARMER" } }),
      prisma.droneReservation.count({ where: { status: "COMPLETED" } }),
      prisma.post.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

  const popularRealtime = popularPool.slice(0, 8);
  const popularWeekly = popularPool.filter((p) => p.createdAt >= sevenDaysAgo).slice(0, 8);

  const topOperators =
    operators.length > 0 ? operators.slice(0, 4).map(toOperatorCardData) : SAMPLE_OPERATORS;

  // 홈 화면 증거 배너용: 표본 데이터로 대체하지 않는다 (실제 값만 노출, 없으면 자리표시자 처리는 호출부에서).
  const realOperators = operators.slice(0, 4).map(toOperatorCardData);

  return {
    recentPosts,
    popularRealtime,
    popularWeekly,
    topOperators,
    realOperators,
    stats: { farmerCount, completedDroneCount, approvedOperatorCount: operators.length, weeklyPostCount },
  };
}
