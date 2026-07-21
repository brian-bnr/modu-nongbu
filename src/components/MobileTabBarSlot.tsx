import { auth } from "@/lib/auth";
import { MobileTabBar } from "@/components/MobileTabBar";

export async function MobileTabBarSlot() {
  const session = await auth();
  const loggedIn = session?.user?.type === "user";
  const role = loggedIn ? (session?.user?.role ?? "FARMER") : undefined;
  return <MobileTabBar loggedIn={loggedIn} role={role} />;
}
