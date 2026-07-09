import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { auth } from "@/lib/auth";

export default async function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const loggedIn = session?.user?.type === "user";

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <div className="hidden sm:block">
        <Footer />
      </div>
      <MobileTabBar loggedIn={loggedIn} />
    </div>
  );
}
