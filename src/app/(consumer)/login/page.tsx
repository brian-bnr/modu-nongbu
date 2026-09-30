import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { userLoginAction, socialLoginAction } from "@/app/(consumer)/login/actions";
import { KakaoIcon, NaverIcon, GoogleIcon } from "@/components/icons/SocialIcons";

const SOCIAL_BUTTONS = [
  {
    provider: "kakao" as const,
    label: "카카오로 계속하기",
    className: "bg-[#FEE500] text-black/85 hover:brightness-95",
    Icon: KakaoIcon,
  },
  {
    provider: "naver" as const,
    label: "네이버로 계속하기",
    className: "bg-[#03C75A] text-white hover:brightness-95",
    Icon: NaverIcon,
  },
  {
    provider: "google" as const,
    label: "구글로 계속하기",
    className: "border border-black/10 bg-white text-black/85 hover:bg-black/5 dark:border-white/20 dark:bg-transparent dark:text-white",
    Icon: GoogleIcon,
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; reset?: string }>;
}) {
  const { callbackUrl, reset } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center px-4 py-12 sm:py-16">
      <h1 className="text-center text-2xl font-bold leading-snug">
        지금 모두의농부에서
        <br />
        <span className="text-brand-600">함께 시작해요</span>!
      </h1>
      <p className="mt-2 text-center text-sm text-black/50 dark:text-white/50">
        글쓰기, 문의하기는 로그인 후 이용할 수 있어요.
      </p>

      <div className="mt-8 w-full overflow-hidden rounded-2xl shadow-lg">
        <img
          src="/login-hero.png"
          alt="노을 진 들녘에서 손을 들어올린 농부들 - 모두가 가꾸는 땅, 모두가 누리는 내일"
          className="h-auto w-full"
        />
      </div>

      {reset === "success" && (
        <p className="mt-6 w-full rounded-md bg-brand-700/10 px-3 py-2 text-center text-sm text-brand-700 dark:text-brand-400">
          비밀번호가 재설정되었습니다. 새 비밀번호로 로그인해주세요.
        </p>
      )}

      <div className="mt-8 w-full space-y-3">
        {SOCIAL_BUTTONS.map(({ provider, label, className, Icon }) => (
          <form
            key={provider}
            action={socialLoginAction.bind(null, provider, callbackUrl ?? "/")}
          >
            <button
              type="submit"
              className={`relative flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-base font-semibold shadow-sm transition ${className}`}
            >
              <Icon className="absolute left-4 h-5 w-5" />
              {label}
            </button>
          </form>
        ))}
      </div>

      <div className="mt-6 flex w-full items-center gap-3 text-xs text-black/40 dark:text-white/40">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        또는
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <div className="mt-6 w-full">
        <LoginForm action={userLoginAction}>
          <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />
        </LoginForm>
      </div>

      <div className="mt-6 flex items-center gap-3 text-sm text-black/50 dark:text-white/50">
        <Link href="/forgot-password" className="hover:underline">
          비밀번호를 잊으셨나요?
        </Link>
        <span className="h-3 w-px bg-black/20 dark:bg-white/20" />
        <Link href="/signup" className="hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
