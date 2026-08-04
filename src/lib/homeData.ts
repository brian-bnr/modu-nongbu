import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getApprovedOperatorsWithStats, toOperatorCardData } from "@/lib/droneOperatorStats";
import { SAMPLE_OPERATORS } from "@/lib/sampleOperators";

export const getHomeData = unstable_cache(
  async (sevenDaysAgoISO: string) => {
    const sevenDaysAgo = new Date(sevenDaysAgoISO);

    const [recentPosts, popularPool, operators] = await Promise.all([
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
    ]);

    const popularRealtime = popularPool.slice(0, 8);
    const popularWeekly = popularPool.filter((p) => p.createdAt >= sevenDaysAgo).slice(0, 8);

    const topOperators =
      operators.length > 0 ? operators.slice(0, 4).map(toOperatorCardData) : SAMPLE_OPERATORS;

    return { recentPosts, popularRealtime, popularWeekly, topOperators };
  },
  ["home-page-data"],
  { revalidate: 300 }
);
