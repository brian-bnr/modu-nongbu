"use client";

import { useActionState } from "react";
import { adminMarkCompleted, type AdminActionState } from "@/app/admin/drones/actions";

const initialState: AdminActionState = {};

export function AdminCompleteReservationForm({ reservationId }: { reservationId: string }) {
  const [state, formAction, isPending] = useActionState(adminMarkCompleted, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="reservationId" value={reservationId} />
      <p className="text-sm text-black/60 dark:text-white/60">
        방제사가 작업을 마쳤다면 완료 처리하세요. 에스크로에 보관 중인 결제금이 정산 대기 상태로
        넘어갑니다.
      </p>
      {state.success && (
        <p className="text-sm text-brand-700 dark:text-brand-400">
          완료 처리되었습니다. 결제금이 정산 대기로 이동했습니다.
        </p>
      )}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        onClick={(e) => {
          if (!window.confirm("작업 완료를 확정할까요? 에스크로 보관액이 정산 대기로 이동합니다.")) {
            e.preventDefault();
          }
        }}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "처리 중..." : "작업 완료 처리"}
      </button>
    </form>
  );
}
