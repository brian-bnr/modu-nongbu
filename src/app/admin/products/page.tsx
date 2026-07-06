import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteProduct } from "@/app/admin/products/actions";
import { formatPrice, STOCK_STATUS_LABEL, STOCK_STATUS_VARIANT } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { farm: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">농산물 관리</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          + 농산물 등록
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">
          등록된 농산물이 없습니다.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/50 dark:border-white/10 dark:text-white/50">
              <tr>
                <th className="py-2 pr-4">이름</th>
                <th className="py-2 pr-4">농가</th>
                <th className="py-2 pr-4">카테고리</th>
                <th className="py-2 pr-4">가격</th>
                <th className="py-2 pr-4">상태</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 pr-4 font-medium">{product.name}</td>
                  <td className="py-2 pr-4">{product.farm.name}</td>
                  <td className="py-2 pr-4">{product.category}</td>
                  <td className="py-2 pr-4">
                    {formatPrice(product.price)} / {product.unit}
                  </td>
                  <td className="py-2 pr-4">
                    <Badge variant={STOCK_STATUS_VARIANT[product.stockStatus]}>
                      {STOCK_STATUS_LABEL[product.stockStatus]}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm text-brand-700 hover:underline dark:text-brand-400"
                      >
                        수정
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <DeleteButton
                          confirmText={`'${product.name}' 상품을 삭제하면 관련 구매요청 내역도 함께 삭제됩니다. 계속하시겠습니까?`}
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
