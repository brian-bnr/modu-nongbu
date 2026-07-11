"use client";

import { useActionState } from "react";
import { updateDroneAdminNote, type AdminActionState } from "@/app/admin/drones/actions";

const initialState: AdminActionState = {};

export function DroneAdminNoteForm({
  reservationId,
  adminNote,
}: {
  reservationId: string;
  adminNote: string | null;
}) {
  const [state, formAction, isPending] = useActionState(updateDroneAdminNote, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="reservationId" value={reservationId} />
      <div>
        <label className="block text-sm font-medium">운영자 메모</label>
        <textarea
          name="adminNote"
          defaultValue={adminNote ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>
      {state.success && <p className="text-sm text-brand-700 dark:text-brand-400">저장되었습니다.</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "메모 저장"}
      </button>
    </form>
  );
}
