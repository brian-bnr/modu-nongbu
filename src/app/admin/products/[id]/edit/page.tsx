import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
import { updateProduct, type ProductActionState } from "@/app/admin/products/actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, farms] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.farm.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  async function updateProductWithId(prevState: ProductActionState, formData: FormData) {
    "use server";
    return updateProduct(id, prevState, formData);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">농산물 수정</h1>
      <div className="mt-6">
        <ProductForm action={updateProductWithId} product={product} farms={farms} />
      </div>
    </div>
  );
}
