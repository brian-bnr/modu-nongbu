"use client";

import { useActionState } from "react";
import type { PostType } from "@prisma/client";
import { createInquiry, type InquiryActionState } from "@/lib/actions/inquiry";

const initialState: InquiryActionState = { status: "idle" };

const SUBMIT_LABEL: Partial<Record<PostType, string>> = {
  SELL_PRODUCT: "구매요청 보내기",
  BUY_PRODUCT: "판매 제안하기",
  FIND_WORKER: "지원하기",
  LOOKING_FOR_WORK: "제안하기",
};

const SHOW_QUANTITY = new Set<PostType>(["SELL_PRODUCT", "BUY_PRODUCT"]);

export function InquiryForm({ postId, postType }: { postId: string; postType: PostType }) {
  const [state, formAction, isPending] = useActionState(createInquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-brand-600/30 bg-brand-50 p-4 text-sm dark:bg-brand-900/20">
        <p className="font-medium text-brand-800 dark:text-brand-300">문의가 접수되었습니다.</p>
        <p className="mt-2 text-black/60 dark:text-white/60">
          작성자에게 연락처가 전달됩니다. &quot;마이페이지 &gt; 내 문의내역&quot;에서 진행 상황을
          확인할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />

      {SHOW_QUANTITY.has(postType) && (
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
      )}

      <div>
        <label className="block text-sm font-medium">전달할 메시지 (선택)</label>
        <textarea
          name="message"
          rows={3}
          placeholder="희망 일정, 문의사항 등을 남겨주세요."
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      {state.status === "error" && state.errors?.postId && (
        <p className="text-sm text-red-600">{state.errors.postId[0]}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "접수 중..." : SUBMIT_LABEL[postType] ?? "문의 보내기"}
      </button>
    </form>
  );
}
