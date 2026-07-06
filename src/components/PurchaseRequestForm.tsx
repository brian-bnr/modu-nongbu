"use client";

import { useActionState } from "react";
import {
  createPurchaseRequest,
  type PurchaseRequestActionState,
} from "@/app/(consumer)/products/[id]/actions";

const initialState: PurchaseRequestActionState = { status: "idle" };

export function PurchaseRequestForm({ productId }: { productId: string }) {
  const [state, formAction, isPending] = useActionState(createPurchaseRequest, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-brand-600/30 bg-brand-50 p-4 text-sm dark:bg-brand-900/20">
        <p className="font-medium text-brand-800 dark:text-brand-300">구매요청이 접수되었습니다.</p>
        <p className="mt-1 text-brand-700 dark:text-brand-400">
          요청번호: {state.requestId}
        </p>
        <p className="mt-2 text-black/60 dark:text-white/60">
          운영자가 확인 후 농가와 연결해 안내드립니다. 상단 &quot;주문 조회&quot;에서 이름과
          연락처로 진행 상황을 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />

      <div>
        <label className="block text-sm font-medium">이름</label>
        <input
          name="customerName"
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.customerName && (
          <p className="mt-1 text-xs text-red-600">{state.errors.customerName[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">연락처</label>
        <input
          name="customerPhone"
          placeholder="010-0000-0000"
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.customerPhone && (
          <p className="mt-1 text-xs text-red-600">{state.errors.customerPhone[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">이메일 (선택)</label>
        <input
          name="customerEmail"
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.customerEmail && (
          <p className="mt-1 text-xs text-red-600">{state.errors.customerEmail[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">수량</label>
        <input
          type="number"
          name="quantity"
          min={1}
          defaultValue={1}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.quantity && (
          <p className="mt-1 text-xs text-red-600">{state.errors.quantity[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">전달할 메시지 (선택)</label>
        <textarea
          name="message"
          rows={3}
          placeholder="배송 희망일, 문의사항 등을 남겨주세요."
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      {state.status === "error" && state.errors?.productId && (
        <p className="text-sm text-red-600">{state.errors.productId[0]}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "요청 접수 중..." : "구매요청 보내기"}
      </button>
    </form>
  );
}
