"use client";

import { useActionState } from "react";
import { adminAssignOperator, type AdminActionState } from "@/app/admin/drones/actions";

const initialState: AdminActionState = {};

export function AdminAssignOperatorForm({
  reservationId,
  operators,
}: {
  reservationId: string;
  operators: { id: string; name: string; region: string | null }[];
}) {
  const [state, formAction, isPending] = useActionState(adminAssignOperator, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="reservationId" value={reservationId} />
      <div>
        <label className="block text-sm font-medium">방제사 배정</label>
        {operators.length === 0 ? (
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            승인된 방제사가 없습니다. 방제사 승인 후 배정할 수 있습니다.
          </p>
        ) : (
          <select
            name="operatorId"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          >
            <option value="" disabled>
              방제사를 선택하세요
            </option>
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
                {op.region ? ` · ${op.region}` : ""}
              </option>
            ))}
          </select>
        )}
      </div>
      {state.success && <p className="text-sm text-brand-700 dark:text-brand-400">배정되었습니다.</p>}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {operators.length > 0 && (
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {isPending ? "배정 중..." : "방제사 배정하기"}
        </button>
      )}
    </form>
  );
}
