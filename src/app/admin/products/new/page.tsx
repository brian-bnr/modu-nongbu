import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
import { createProduct } from "@/app/admin/products/actions";

export default async function NewProductPage() {
  const farms = await prisma.farm.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold">농산물 등록</h1>
      <div className="mt-6">
        {farms.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">
            먼저 농가를 등록해주세요.
          </p>
        ) : (
          <ProductForm action={createProduct} farms={farms} />
        )}
      </div>
    </div>
  );
}
