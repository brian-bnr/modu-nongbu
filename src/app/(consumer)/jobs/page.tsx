import type { PostType } from "@prisma/client";
import { PostListingPage } from "@/components/PostListingPage";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string; category?: string; region?: string }>;
}) {
  const { type, q, category, region } = await searchParams;
  const activeType: PostType = type === "LOOKING_FOR_WORK" ? "LOOKING_FOR_WORK" : "FIND_WORKER";

  return (
    <PostListingPage
      heading="일자리"
      description="일손이 필요한 농가와, 일하고 싶은 사람을 연결합니다."
      basePath="/jobs"
      newHref={`/jobs/new?type=${activeType}`}
      activeType={activeType}
      tabs={[
        { type: "FIND_WORKER", label: "일손구해요" },
        { type: "LOOKING_FOR_WORK", label: "일하고싶어요" },
      ]}
      q={q}
      category={category}
      region={region}
    />
  );
}
