import { LoginForm } from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">운영자 로그인</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        농가·농산물·구매요청을 관리하려면 로그인하세요.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
