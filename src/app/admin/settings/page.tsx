import { prisma } from "@/lib/prisma";
import { PlatformSettingForm } from "@/components/PlatformSettingForm";

export default async function AdminSettingsPage() {
  const setting = await prisma.platformSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">설정</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        드론 방제 예약의 기본 단가와 수수료율을 관리합니다.
      </p>
      <div className="mt-6">
        <PlatformSettingForm setting={setting} />
      </div>
    </div>
  );
}
