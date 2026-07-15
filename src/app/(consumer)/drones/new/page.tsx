import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DroneReservationForm } from "@/components/DroneReservationForm";

export default async function NewDroneReservationPage() {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect("/login?callbackUrl=/drones/new");
  }

  const setting = await prisma.platformSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl dark:bg-brand-900/40">
          🚁
        </span>
        <div>
          <h1 className="text-2xl font-bold">드론 방제 신청</h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            위치와 면적, 작물을 입력하면 예상 견적을 바로 확인할 수 있어요.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <DroneReservationForm unitPrice={setting.droneUnitPrice} />
      </div>
    </div>
  );
}
