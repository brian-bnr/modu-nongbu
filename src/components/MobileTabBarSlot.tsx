import { auth } from "@/lib/auth";
import { MobileTabBar } from "@/components/MobileTabBar";

export async function MobileTabBarSlot() {
  const session = await auth();
  const loggedIn = session?.user?.type === "user";
  return <MobileTabBar loggedIn={loggedIn} />;
}
