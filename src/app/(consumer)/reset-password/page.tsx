import Link from "next/link";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { resetPasswordAction } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-xl font-bold">잘못된 접근입니다</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          비밀번호 재설정 링크가 올바르지 않습니다.{" "}
          <Link href="/forgot-password" className="text-brand-700 hover:underline dark:text-brand-400">
            비밀번호 찾기
          </Link>
          를 다시 요청해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">비밀번호 재설정</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">새로 사용할 비밀번호를 입력해주세요.</p>
      <div className="mt-6">
        <ResetPasswordForm action={resetPasswordAction} token={token} />
      </div>
    </div>
  );
}
