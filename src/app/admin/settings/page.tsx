import { prisma } from "@/lib/prisma";
import { PlatformSettingForm } from "@/components/PlatformSettingForm";
import { PageIntro, SectionCard } from "@/components/admin/AdminUI";

export default async function AdminSettingsPage() {
  const setting = await prisma.platformSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div>
      <PageIntro title="설정" subtitle="드론 방제 예약의 기본 단가와 수수료율을 관리합니다." />

      <div className="mt-6">
        <SectionCard title="플랫폼 설정" tone="indigo" delay={0}>
          <PlatformSettingForm setting={setting} />
        </SectionCard>
      </div>
    </div>
  );
}
