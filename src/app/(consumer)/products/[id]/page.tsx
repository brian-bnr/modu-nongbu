import { PostDetail } from "@/components/PostDetail";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetail id={id} allowedTypes={["SELL_PRODUCT", "BUY_PRODUCT"]} basePath="/products" />;
}
