import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export async function HeaderAuthSlot() {
  const session = await auth();
  const isUser = session?.user?.type === "user";

  if (isUser) {
    return (
      <>
        <Link
          href="/my"
          className="hidden rounded-md border border-white/25 px-3 py-1.5 hover:bg-white/10 sm:block"
        >
          마이페이지
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="whitespace-nowrap text-white/70 hover:underline">
            로그아웃
          </button>
        </form>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className="whitespace-nowrap rounded-md border border-white/25 px-2 py-1 hover:bg-white/10 sm:px-3 sm:py-1.5"
    >
      로그인
    </Link>
  );
}
