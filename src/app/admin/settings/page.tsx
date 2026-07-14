import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PlatformSettingForm } from "@/components/PlatformSettingForm";
import { AdminAccountForm } from "@/components/AdminAccountForm";
import { PageIntro, SectionCard } from "@/components/admin/AdminUI";

export default async function AdminSettingsPage() {
  const session = await auth();
  const [setting, admin] = await Promise.all([
    prisma.platformSetting.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
    session?.user?.id
      ? prisma.admin.findUnique({ where: { id: session.user.id } })
      : Promise.resolve(null),
  ]);

  return (
    <div>
      <PageIntro title="설정" subtitle="드론 방제 예약의 기본 단가와 수수료율을 관리합니다." />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="플랫폼 설정" tone="indigo" delay={0}>
          <PlatformSettingForm setting={setting} />
        </SectionCard>

        {admin && (
          <SectionCard title="관리자 계정" tone="teal" delay={80}>
            <AdminAccountForm email={admin.email} />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
