"use client";

import { useActionState } from "react";
import { loginAction, type LoginActionState } from "@/app/admin/login/actions";

const initialState: LoginActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">이메일</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">비밀번호</label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
