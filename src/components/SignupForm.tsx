"use client";

import { useActionState } from "react";
import { signupAction, type SignupActionState } from "@/app/(consumer)/signup/actions";

const initialState: SignupActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">이름</label>
        <input name="name" className={fieldClass} />
        {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">연락처</label>
        <input name="phone" placeholder="010-0000-0000" className={fieldClass} />
        {state.errors?.phone && <p className="mt-1 text-xs text-red-600">{state.errors.phone[0]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">이메일</label>
        <input name="email" type="email" className={fieldClass} />
        {state.errors?.email && <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">비밀번호</label>
        <input name="password" type="password" className={fieldClass} />
        {state.errors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">지역 (선택)</label>
        <input name="region" placeholder="예: 전남 나주시" className={fieldClass} />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
