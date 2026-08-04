"use client";

import { useActionState, useState } from "react";
import { submitOperatorReview, type ReviewActionState } from "@/lib/actions/review";

const initialState: ReviewActionState = { status: "idle" };

export function ReviewForm({ reservationId }: { reservationId: string }) {
  const action = submitOperatorReview.bind(null, reservationId);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [rating, setRating] = useState(0);

  if (state.status === "success") {
    return (
      <p className="rounded-lg border border-black/10 p-4 text-sm">
        리뷰가 등록되었습니다. 감사합니다!
      </p>
    );
  }

  return (
    <form action={formAction} className="rounded-lg border border-black/10 p-4">
      <p className="text-sm font-medium">방제사에게 별점과 후기를 남겨주세요</p>
      <input type="hidden" name="rating" value={rating} />
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n}점`}
            className={`text-2xl leading-none ${n <= rating ? "text-amber-400" : "text-black/15"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={3}
        placeholder="작업은 어떠셨나요? (선택)"
        className="mt-3 w-full rounded-md border border-black/10 px-3 py-2 text-sm"
      />
      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="mt-3 w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "등록 중..." : "리뷰 등록"}
      </button>
    </form>
  );
}
