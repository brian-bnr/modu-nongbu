"use client";

import { useActionState, useState } from "react";
import type { ProfileUpdateActionState } from "@/app/(consumer)/my/profile/actions";

const initialState: ProfileUpdateActionState = {};

export function ProfileEditForm({
  action,
  defaultName,
  defaultPhone,
}: {
  action: (
    state: ProfileUpdateActionState,
    formData: FormData
  ) => Promise<ProfileUpdateActionState>;
  defaultName: string;
  defaultPhone: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">이름</label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
        {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">휴대폰 번호</label>
        <input
          name="phone"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
        />
        {state.errors?.phone && <p className="mt-1 text-xs text-red-600">{state.errors.phone[0]}</p>}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
