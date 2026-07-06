"use client";

import { useActionState } from "react";
import type { Farm } from "@prisma/client";
import type { FarmActionState } from "@/app/admin/farms/actions";

const initialState: FarmActionState = {};

export function FarmForm({
  action,
  farm,
}: {
  action: (state: FarmActionState, formData: FormData) => Promise<FarmActionState>;
  farm?: Farm;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium">농가 이름</label>
        <input
          name="name"
          defaultValue={farm?.name}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">지역 (시/도)</label>
          <input
            name="region"
            defaultValue={farm?.region}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
          {state.errors?.region && (
            <p className="mt-1 text-xs text-red-600">{state.errors.region[0]}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">상세 지역 (선택)</label>
          <input
            name="regionDetail"
            defaultValue={farm?.regionDetail ?? ""}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">소개 (선택)</label>
        <textarea
          name="description"
          defaultValue={farm?.description ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">담당자 이름</label>
          <input
            name="contactName"
            defaultValue={farm?.contactName}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
          {state.errors?.contactName && (
            <p className="mt-1 text-xs text-red-600">{state.errors.contactName[0]}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">연락처</label>
          <input
            name="contactPhone"
            defaultValue={farm?.contactPhone}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
          {state.errors?.contactPhone && (
            <p className="mt-1 text-xs text-red-600">{state.errors.contactPhone[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">이메일 (선택)</label>
        <input
          name="contactEmail"
          defaultValue={farm?.contactEmail ?? ""}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.contactEmail && (
          <p className="mt-1 text-xs text-red-600">{state.errors.contactEmail[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">이미지 URL (선택)</label>
        <input
          name="imageUrl"
          defaultValue={farm?.imageUrl ?? ""}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-xs text-red-600">{state.errors.imageUrl[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
