import { cookies } from "next/headers";
import { RegionPicker } from "@/components/RegionPicker";
import { REGIONS } from "@/lib/regions";

export async function RegionPickerSlot() {
  const cookieStore = await cookies();
  const current = cookieStore.get("region")?.value ?? "";

  return <RegionPicker current={current} regions={[...REGIONS]} />;
}
