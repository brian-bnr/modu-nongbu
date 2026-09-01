"use client";

import { useActionState } from "react";
import type { ForgotPasswordActionState } from "@/app/(consumer)/forgot-password/actions";

const initialState: ForgotPasswordActionState = {};

export function ForgotPasswordForm({
  action,
}: {
  action: (
    state: ForgotPasswordActionState,
    formData: FormData
  ) => Promise<ForgotPasswordActionState>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.success) {
    return (
      <p className="text-sm text-black/70 dark:text-white/70">
        입력하신 이메일로 가입된 계정이 있다면 비밀번호 재설정 링크를 보냈습니다. 메일함(스팸함 포함)을 확인해주세요.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">가입 시 등록한 이메일</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "전송 중..." : "재설정 링크 받기"}
      </button>
    </form>
  );
}
