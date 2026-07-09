import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { userLoginAction } from "@/app/(consumer)/login/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">로그인</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        글쓰기, 문의하기는 로그인 후 이용할 수 있어요.
      </p>
      <div className="mt-6">
        <LoginForm action={userLoginAction}>
          <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />
        </LoginForm>
      </div>
      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="text-brand-700 hover:underline dark:text-brand-400">
          회원가입
        </Link>
      </p>
    </div>
  );
}
