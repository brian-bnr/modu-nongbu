import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-bold">회원가입</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        하나의 계정으로 농산물 판매·구매, 일손 모집·지원 등 모든 글을 올릴 수 있어요.
      </p>
      <div className="mt-6">
        <SignupForm />
      </div>
      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-brand-700 hover:underline dark:text-brand-400">
          로그인
        </Link>
      </p>
    </div>
  );
}
