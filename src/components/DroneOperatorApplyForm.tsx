"use client";

import { useActionState } from "react";
import {
  applyAsDroneOperator,
  type DroneOperatorActionState,
} from "@/lib/actions/droneOperator";

const initialState: DroneOperatorActionState = { status: "idle" };

export function DroneOperatorApplyForm() {
  const [state, formAction, isPending] = useActionState(applyAsDroneOperator, initialState);

  if (state.status === "success") {
    return (
      <p className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        신청이 접수되었습니다. 관리자 승인 후 활동하실 수 있어요.
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium">보유 장비 / 자격 정보 (선택)</label>
        <textarea
          name="equipmentInfo"
          rows={4}
          placeholder="드론 기종, 방제 자격증, 경력 등을 입력해주세요."
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "신청 중..." : "방제사 신청하기"}
      </button>
    </form>
  );
}
