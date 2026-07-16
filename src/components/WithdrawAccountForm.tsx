"use client";

import { useActionState, useState } from "react";
import type { WithdrawActionState } from "@/app/(consumer)/my/profile/actions";

const initialState: WithdrawActionState = {};

export function WithdrawAccountForm({
  action,
  requirePassword,
}: {
  action: (state: WithdrawActionState, formData: FormData) => Promise<WithdrawActionState>;
  requirePassword: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [confirmed, setConfirmed] = useState(false);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  return (
    <form action={formAction} className="space-y-4">
      {requirePassword && (
        <div>
          <label className="block text-sm font-medium">비밀번호</label>
          <input name="password" type="password" className={fieldClass} />
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="h-4 w-4"
        />
        안내 사항을 확인했으며 탈퇴에 동의합니다.
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending || !confirmed}
        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {isPending ? "처리 중..." : "탈퇴하기"}
      </button>
    </form>
  );
}
