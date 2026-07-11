"use client";

import { useActionState } from "react";
import { updatePlatformSetting, type SettingsActionState } from "@/app/admin/settings/actions";
import type { PlatformSetting } from "@prisma/client";

const initialState: SettingsActionState = {};

export function PlatformSettingForm({ setting }: { setting: PlatformSetting }) {
  const [state, formAction, isPending] = useActionState(updatePlatformSetting, initialState);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium">드론 방제 평당 단가 (원)</label>
        <input
          type="number"
          name="droneUnitPrice"
          min={0}
          defaultValue={setting.droneUnitPrice}
          className={fieldClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">정산 수수료율 (%)</label>
        <input
          type="number"
          name="droneCommissionRate"
          min={0}
          max={100}
          defaultValue={setting.droneCommissionRate}
          className={fieldClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">취소 수수료율 (%) — 배정 후~작업 시작 전 취소 시</label>
        <input
          type="number"
          name="droneCancelFeeRate"
          min={0}
          max={100}
          defaultValue={setting.droneCancelFeeRate}
          className={fieldClass}
        />
      </div>
      {state.success && <p className="text-sm text-brand-700 dark:text-brand-400">저장되었습니다.</p>}
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
