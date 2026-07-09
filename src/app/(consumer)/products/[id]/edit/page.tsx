import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";
import { updatePost } from "@/lib/actions/post";

export default async function EditProductPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect(`/login?callbackUrl=/products/${id}/edit`);
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || !["SELL_PRODUCT", "BUY_PRODUCT"].includes(post.postType)) {
    notFound();
  }
  if (post.authorId !== session.user.id) {
    redirect(`/products/${id}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">글 수정</h1>
      <div className="mt-6">
        <PostForm
          action={updatePost.bind(null, id)}
          post={post}
          allowedTypes={[
            { value: "SELL_PRODUCT", label: "판매해요" },
            { value: "BUY_PRODUCT", label: "구매하고 싶어요" },
          ]}
          priceLabel="가격 (원)"
          unitLabel="단위"
          unitPlaceholder="kg, 박스, 개 등"
          categoryLabel="카테고리"
          categoryPlaceholder="과일, 채소, 곡물 등"
        />
      </div>
    </div>
  );
}
