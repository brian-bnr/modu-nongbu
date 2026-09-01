"use client";

import { useActionState } from "react";
import type { ResetPasswordActionState } from "@/app/(consumer)/reset-password/actions";

const initialState: ResetPasswordActionState = {};

export function ResetPasswordForm({
  action,
  token,
}: {
  action: (
    state: ResetPasswordActionState,
    formData: FormData
  ) => Promise<ResetPasswordActionState>;
  token: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="block text-sm font-medium">새 비밀번호</label>
        <input name="newPassword" type="password" className={fieldClass} />
        {state.errors?.newPassword && (
          <p className="mt-1 text-xs text-red-600">{state.errors.newPassword[0]}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">새 비밀번호 확인</label>
        <input name="newPasswordConfirm" type="password" className={fieldClass} />
        {state.errors?.newPasswordConfirm && (
          <p className="mt-1 text-xs text-red-600">{state.errors.newPasswordConfirm[0]}</p>
        )}
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "변경 중..." : "비밀번호 재설정"}
      </button>
    </form>
  );
}
