"use client";

import { useActionState, useState } from "react";
import type { InquiryActionState } from "@/lib/actions/inquiry";

const initialState: InquiryActionState = { status: "idle" };

export function InquiryEditForm({
  action,
  defaultMessage,
  defaultQuantity,
  showQuantity,
}: {
  action: (state: InquiryActionState, formData: FormData) => Promise<InquiryActionState>;
  defaultMessage: string;
  defaultQuantity?: number;
  showQuantity: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [quantity, setQuantity] = useState(defaultQuantity ? String(defaultQuantity) : "1");
  const [message, setMessage] = useState(defaultMessage);

  return (
    <form action={formAction} className="space-y-4">
      {showQuantity && (
        <div>
          <label className="block text-sm font-medium">수량</label>
          <input
            type="number"
            name="quantity"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
          {state.errors?.quantity && (
            <p className="mt-1 text-xs text-red-600">{state.errors.quantity[0]}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">전달할 메시지</label>
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      {state.errors?.message && <p className="text-sm text-red-600">{state.errors.message[0]}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "수정 저장"}
      </button>
    </form>
  );
}
