import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteFarm } from "@/app/admin/farms/actions";

export default async function AdminFarmsPage() {
  const farms = await prisma.farm.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">농가 관리</h1>
        <Link
          href="/admin/farms/new"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          + 농가 등록
        </Link>
      </div>

      {farms.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">등록된 농가가 없습니다.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/50 dark:border-white/10 dark:text-white/50">
              <tr>
                <th className="py-2 pr-4">이름</th>
                <th className="py-2 pr-4">지역</th>
                <th className="py-2 pr-4">담당자</th>
                <th className="py-2 pr-4">연락처</th>
                <th className="py-2 pr-4">농산물</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {farms.map((farm) => (
                <tr key={farm.id}>
                  <td className="py-2 pr-4 font-medium">{farm.name}</td>
                  <td className="py-2 pr-4">
                    {farm.region}
                    {farm.regionDetail ? ` · ${farm.regionDetail}` : ""}
                  </td>
                  <td className="py-2 pr-4">{farm.contactName}</td>
                  <td className="py-2 pr-4">{farm.contactPhone}</td>
                  <td className="py-2 pr-4">{farm._count.products}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/farms/${farm.id}/edit`}
                        className="text-sm text-brand-700 hover:underline dark:text-brand-400"
                      >
                        수정
                      </Link>
                      <form action={deleteFarm.bind(null, farm.id)}>
                        <DeleteButton
                          confirmText={`'${farm.name}' 농가를 삭제하면 등록된 농산물과 구매요청 내역도 함께 삭제됩니다. 계속하시겠습니까?`}
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
