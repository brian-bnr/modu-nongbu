"use client";

import { useActionState } from "react";
import { updateAdminAccount, type SettingsActionState } from "@/app/admin/settings/actions";

const initialState: SettingsActionState = {};

export function AdminAccountForm({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(updateAdminAccount, initialState);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium">이메일</label>
        <input type="email" name="newEmail" required defaultValue={email} className={fieldClass} />
      </div>
      <div>
        <label className="block text-sm font-medium">새 비밀번호 (변경 시에만 입력)</label>
        <input type="password" name="newPassword" autoComplete="new-password" className={fieldClass} />
      </div>
      <div>
        <label className="block text-sm font-medium">새 비밀번호 확인</label>
        <input
          type="password"
          name="newPasswordConfirm"
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">현재 비밀번호 확인</label>
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>
      {state.success && (
        <p className="text-sm text-brand-700 dark:text-brand-400">
          저장되었습니다. 변경한 정보로 다시 로그인해주세요.
        </p>
      )}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
