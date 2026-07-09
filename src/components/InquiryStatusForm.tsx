"use client";

import { useActionState } from "react";
import type { Inquiry, InquiryStatus } from "@prisma/client";
import { updateInquiryStatus, type InquiryStatusActionState } from "@/app/admin/inquiries/actions";
import { INQUIRY_STATUS_LABEL } from "@/lib/format";

const STATUS_OPTIONS: InquiryStatus[] = ["REQUESTED", "ACCEPTED", "COMPLETED", "CANCELLED"];

const initialState: InquiryStatusActionState = {};

export function InquiryStatusForm({ inquiry }: { inquiry: Inquiry }) {
  const [state, formAction, isPending] = useActionState(updateInquiryStatus, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="inquiryId" value={inquiry.id} />

      <div>
        <label className="block text-sm font-medium">상태</label>
        <select
          name="status"
          defaultValue={inquiry.status}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {INQUIRY_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">운영자 메모 (선택)</label>
        <textarea
          name="adminNote"
          defaultValue={inquiry.adminNote ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      {state.success && (
        <p className="text-sm text-brand-700 dark:text-brand-400">저장되었습니다.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "상태 저장"}
      </button>
    </form>
  );
}
