import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { userLoginAction, socialLoginAction } from "@/app/(consumer)/login/actions";
import { KakaoIcon, NaverIcon, GoogleIcon } from "@/components/icons/SocialIcons";

const SOCIAL_BUTTONS = [
  {
    provider: "naver" as const,
    label: "네이버로 로그인",
    className: "bg-[#03C75A] text-white hover:brightness-95",
    Icon: NaverIcon,
  },
  {
    provider: "kakao" as const,
    label: "카카오로 로그인",
    className: "bg-[#FEE500] text-black/85 hover:brightness-95",
    Icon: KakaoIcon,
  },
  {
    provider: "google" as const,
    label: "구글로 로그인",
    className: "border border-black/10 bg-white text-black/85 hover:bg-black/5 dark:border-white/20 dark:bg-transparent dark:text-white",
    Icon: GoogleIcon,
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto flex max-w-6xl flex-col lg:flex-row lg:items-stretch">
      <div className="relative h-48 w-full overflow-hidden sm:h-64 lg:h-auto lg:w-1/2">
        <img
          src="/login-hero.png"
          alt="노을 진 들녘에서 손을 들어올린 농부들 - 모두가 가꾸는 땅, 모두가 누리는 내일"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-bold">로그인</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            글쓰기, 문의하기는 로그인 후 이용할 수 있어요.
          </p>
          <div className="mt-6">
            <LoginForm action={userLoginAction}>
              <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />
            </LoginForm>
          </div>
          <div className="mt-6 flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
            <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            간편 로그인
            <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          </div>
          <div className="mt-4 space-y-2">
            {SOCIAL_BUTTONS.map(({ provider, label, className, Icon }) => (
              <form
                key={provider}
                action={socialLoginAction.bind(null, provider, callbackUrl ?? "/")}
              >
                <button
                  type="submit"
                  className={`relative flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium shadow-sm transition ${className}`}
                >
                  <Icon className="absolute left-4 h-5 w-5" />
                  {label}
                </button>
              </form>
            ))}
          </div>
          <p className="mt-4 text-sm text-black/60 dark:text-white/60">
            아직 계정이 없으신가요?{" "}
            <Link href="/signup" className="text-brand-700 hover:underline dark:text-brand-400">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
