import type { PostType } from "@prisma/client";
import { PostListingPage } from "@/components/PostListingPage";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string; category?: string; region?: string; sort?: string }>;
}) {
  const { type, q, category, region, sort } = await searchParams;
  const activeType: PostType = type === "BUY_PRODUCT" ? "BUY_PRODUCT" : "SELL_PRODUCT";

  return (
    <PostListingPage
      heading="농산물"
      description="농민이 올린 판매 글, 소비자가 올린 구매 글을 한곳에서 확인하세요."
      basePath="/products"
      newHref={`/products/new?type=${activeType}`}
      activeType={activeType}
      tabs={[
        { type: "SELL_PRODUCT", label: "팔아요" },
        { type: "BUY_PRODUCT", label: "구해요" },
      ]}
      q={q}
      category={category}
      region={region}
      sort={sort}
    />
  );
}
