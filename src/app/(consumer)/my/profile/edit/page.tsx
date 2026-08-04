import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { updateProfileAction } from "../actions";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session || session.user.type !== "user") {
    redirect("/login?callbackUrl=/my/profile/edit");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/my/profile/edit");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">내 정보 수정</h1>
      <div className="mt-6">
        <ProfileEditForm
          action={updateProfileAction}
          defaultName={user.name}
          defaultPhone={user.phone ?? ""}
        />
      </div>
    </div>
  );
}
