import { PostForm } from "@/components/PostForm";
import { createPost } from "@/lib/actions/post";

export default async function NewJobPostPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const defaultType = type === "LOOKING_FOR_WORK" ? "LOOKING_FOR_WORK" : "FIND_WORKER";

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">일자리 글쓰기</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        일손을 구하거나, 일하고 싶은 곳을 찾을 때 등록해보세요.
      </p>
      <div className="mt-6">
        <PostForm
          action={createPost}
          defaultType={defaultType}
          allowedTypes={[
            { value: "FIND_WORKER", label: "일손을 구해요" },
            { value: "LOOKING_FOR_WORK", label: "일하고 싶어요" },
          ]}
          priceLabel="일당/급여 (원)"
          unitLabel="급여 단위"
          unitPlaceholder="일당, 시급, 월급 등"
          categoryLabel="작업 종류"
          categoryPlaceholder="수확, 파종, 방제 등"
        />
      </div>
    </div>
  );
}
