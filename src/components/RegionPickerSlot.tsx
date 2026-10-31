import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { RegionPicker } from "@/components/RegionPicker";

export async function RegionPickerSlot() {
  const [cookieStore, rows] = await Promise.all([
    cookies(),
    prisma.post.findMany({
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    }),
  ]);

  const current = cookieStore.get("region")?.value ?? "";
  const regions = rows.map((r) => r.region);

  return <RegionPicker current={current} regions={regions} />;
}
