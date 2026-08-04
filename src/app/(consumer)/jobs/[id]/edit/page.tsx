import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";
import { updatePost } from "@/lib/actions/post";

export default async function EditJobPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect(`/login?callbackUrl=/jobs/${id}/edit`);
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || !["FIND_WORKER", "LOOKING_FOR_WORK"].includes(post.postType)) {
    notFound();
  }
  if (post.authorId !== session.user.id) {
    redirect(`/jobs/${id}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">글 수정</h1>
      <div className="mt-6">
        <PostForm
          action={updatePost.bind(null, id)}
          post={post}
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
