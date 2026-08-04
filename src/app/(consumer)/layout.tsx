import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { MobileTabBarSlot } from "@/components/MobileTabBarSlot";

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <div className="pb-16 sm:pb-0">
        <Footer />
      </div>
      <Suspense fallback={<MobileTabBar loggedIn={false} />}>
        <MobileTabBarSlot />
      </Suspense>
    </div>
  );
}
