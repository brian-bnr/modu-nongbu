"use client";

import { useActionState } from "react";
import { resolveDispute, type AdminActionState } from "@/app/admin/drones/actions";

const initialState: AdminActionState = {};

export function DisputeResolveForm({
  disputeId,
  reservationId,
  resolution,
}: {
  disputeId: string;
  reservationId: string;
  resolution: string | null;
}) {
  const [state, formAction, isPending] = useActionState(resolveDispute, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="disputeId" value={disputeId} />
      <input type="hidden" name="reservationId" value={reservationId} />
      <div>
        <label className="block text-sm font-medium">처리 결과</label>
        <textarea
          name="resolution"
          defaultValue={resolution ?? ""}
          rows={3}
          placeholder="분쟁 처리 결과를 입력해주세요."
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>
      {state.success && <p className="text-sm text-brand-700 dark:text-brand-400">처리되었습니다.</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "처리 중..." : "분쟁 해결 처리"}
      </button>
    </form>
  );
}
