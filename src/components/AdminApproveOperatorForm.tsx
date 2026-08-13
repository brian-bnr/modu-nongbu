"use client";

import { useActionState } from "react";
import { adminApproveAsOperator, type AdminUserActionState } from "@/app/admin/users/actions";

const initialState: AdminUserActionState = {};

export function AdminApproveOperatorForm({ userId, label }: { userId: string; label: string }) {
  const [state, formAction, isPending] = useActionState(adminApproveAsOperator, initialState);

  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="userId" value={userId} />
      {state.success && (
        <p className="mb-2 text-sm text-brand-700 dark:text-brand-400">방제사로 승인되었습니다.</p>
      )}
      {state.error && <p className="mb-2 text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "처리 중..." : label}
      </button>
    </form>
  );
}
