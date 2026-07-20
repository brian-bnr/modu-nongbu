"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

export type SignupActionState = {
  errors?: Record<string, string[] | undefined>;
};

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
    region: formData.get("region"),
    role: formData.get("role"),
    hasPaddyField: formData.get("hasPaddyField") || undefined,
    hasUplandField: formData.get("hasUplandField") || undefined,
    droneModel: formData.get("droneModel"),
    experienceYears: formData.get("experienceYears"),
    activityRegion: formData.get("activityRegion"),
    equipmentInfo: formData.get("equipmentInfo"),
    specialty: formData.get("specialty") || undefined,
    bio: formData.get("bio"),
    companyType: formData.get("companyType"),
    mainItem: formData.get("mainItem"),
    businessInfo: formData.get("businessInfo"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { errors: { email: ["이미 가입된 이메일입니다."] } };
  }

  const data = parsed.data;

  await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      passwordHash: await bcrypt.hash(data.password, 10),
      region: data.region || null,
      role: data.role,
      hasPaddyField: data.role === "FARMER" ? data.hasPaddyField ?? null : null,
      hasUplandField: data.role === "FARMER" ? data.hasUplandField ?? null : null,
      droneOperator:
        data.role === "OPERATOR"
          ? {
              create: {
                droneModel: data.droneModel || null,
                experienceYears: data.experienceYears ?? null,
                activityRegion: data.activityRegion || null,
                equipmentInfo: data.equipmentInfo || null,
              },
            }
          : undefined,
      expertProfile:
        data.role === "EXPERT" && data.specialty
          ? {
              create: {
                specialty: data.specialty,
                activityRegion: data.activityRegion || null,
                bio: data.bio || null,
              },
            }
          : undefined,
      companyProfile:
        data.role === "COMPANY"
          ? {
              create: {
                companyType: data.companyType || "",
                mainItem: data.mainItem || null,
                activityRegion: data.activityRegion || null,
                businessInfo: data.businessInfo || null,
              },
            }
          : undefined,
    },
  });

  try {
    await signIn("user", {
      email: data.email,
      password: data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        errors: { email: ["가입은 완료됐지만 로그인에 실패했습니다. 다시 로그인해주세요."] },
      };
    }
    throw error;
  }

  return {};
}
