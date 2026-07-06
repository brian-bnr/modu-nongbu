import { FarmForm } from "@/components/FarmForm";
import { createFarm } from "@/app/admin/farms/actions";

export default function NewFarmPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">농가 등록</h1>
      <div className="mt-6">
        <FarmForm action={createFarm} />
      </div>
    </div>
  );
}
