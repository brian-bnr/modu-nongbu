"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { farmSchema } from "@/lib/validation";

export type FarmActionState = {
  errors?: Record<string, string[] | undefined>;
};

function parseFarmForm(formData: FormData) {
  return farmSchema.safeParse({
    name: formData.get("name"),
    region: formData.get("region"),
    regionDetail: formData.get("regionDetail"),
    description: formData.get("description"),
    contactName: formData.get("contactName"),
    contactPhone: formData.get("contactPhone"),
    contactEmail: formData.get("contactEmail"),
    imageUrl: formData.get("imageUrl"),
  });
}

export async function createFarm(
  _prevState: FarmActionState,
  formData: FormData
): Promise<FarmActionState> {
  const parsed = parseFarmForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.farm.create({
    data: {
      ...parsed.data,
      regionDetail: parsed.data.regionDetail || null,
      description: parsed.data.description || null,
      contactEmail: parsed.data.contactEmail || null,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/farms");
  revalidatePath("/farms");
  revalidatePath("/");
  redirect("/admin/farms");
}

export async function updateFarm(
  id: string,
  _prevState: FarmActionState,
  formData: FormData
): Promise<FarmActionState> {
  const parsed = parseFarmForm(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.farm.update({
    where: { id },
    data: {
      ...parsed.data,
      regionDetail: parsed.data.regionDetail || null,
      description: parsed.data.description || null,
      contactEmail: parsed.data.contactEmail || null,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/farms");
  revalidatePath(`/farms/${id}`);
  revalidatePath("/");
  redirect("/admin/farms");
}

export async function deleteFarm(id: string) {
  await prisma.farm.delete({ where: { id } });
  revalidatePath("/admin/farms");
  revalidatePath("/farms");
  revalidatePath("/");
  redirect("/admin/farms");
}
