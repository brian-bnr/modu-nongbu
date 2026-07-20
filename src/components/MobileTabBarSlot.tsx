import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MobileTabBar } from "@/components/MobileTabBar";

export async function MobileTabBarSlot() {
  const session = await auth();
  const loggedIn = session?.user?.type === "user";

  if (!loggedIn) {
    return <MobileTabBar loggedIn={false} />;
  }

  // JWT의 role은 로그인 시점 기준이라 모드 전환 직후에는 오래된 값일 수 있으므로 DB에서 다시 읽는다.
  const dbUser = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { role: true },
  });

  return <MobileTabBar loggedIn={true} role={dbUser?.role ?? "FARMER"} />;
}
