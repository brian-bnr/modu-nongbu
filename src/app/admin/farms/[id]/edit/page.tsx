import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FarmForm } from "@/components/FarmForm";
import { updateFarm, type FarmActionState } from "@/app/admin/farms/actions";

export default async function EditFarmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const farm = await prisma.farm.findUnique({ where: { id } });

  if (!farm) {
    notFound();
  }

  async function updateFarmWithId(prevState: FarmActionState, formData: FormData) {
    "use server";
    return updateFarm(id, prevState, formData);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">농가 수정</h1>
      <div className="mt-6">
        <FarmForm action={updateFarmWithId} farm={farm} />
      </div>
    </div>
  );
}
