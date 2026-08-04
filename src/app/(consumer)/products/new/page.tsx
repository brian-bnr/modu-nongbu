import { PostForm } from "@/components/PostForm";
import { createPost } from "@/lib/actions/post";

export default async function NewProductPostPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const defaultType = type === "BUY_PRODUCT" ? "BUY_PRODUCT" : "SELL_PRODUCT";

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">농산물 글쓰기</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        판매할 농산물 또는 구매하고 싶은 농산물을 등록해보세요.
      </p>
      <div className="mt-6">
        <PostForm
          action={createPost}
          defaultType={defaultType}
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
