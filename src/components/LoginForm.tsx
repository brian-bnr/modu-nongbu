"use client";

import { useActionState, useState } from "react";

export type LoginActionState = {
  error?: string;
};

const initialState: LoginActionState = {};

export function LoginForm({
  action,
  submitLabel = "로그인",
  children,
}: {
  action: (state: LoginActionState, formData: FormData) => Promise<LoginActionState>;
  submitLabel?: string;
  children?: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      {children}
      <div>
        <label className="block text-sm font-medium">이메일</label>
        <input
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {isPending ? `${submitLabel} 중...` : submitLabel}
      </button>
    </form>
  );
}
