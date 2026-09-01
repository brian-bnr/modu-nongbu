import Link from "next/link";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">비밀번호 찾기</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드려요.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm action={forgotPasswordAction} />
      </div>
      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        <Link href="/login" className="text-brand-700 hover:underline dark:text-brand-400">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
