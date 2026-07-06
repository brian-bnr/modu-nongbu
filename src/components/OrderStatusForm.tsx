"use client";

import { useActionState } from "react";
import type { PurchaseRequest } from "@prisma/client";
import { updateOrderStatus, type OrderStatusActionState } from "@/app/admin/orders/actions";
import { REQUEST_STATUS_LABEL } from "@/lib/format";
import type { RequestStatus } from "@prisma/client";

const STATUS_OPTIONS: RequestStatus[] = [
  "REQUESTED",
  "CONFIRMED",
  "PAYMENT_PENDING",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

const initialState: OrderStatusActionState = {};

export function OrderStatusForm({ request }: { request: PurchaseRequest }) {
  const [state, formAction, isPending] = useActionState(updateOrderStatus, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="requestId" value={request.id} />

      <div>
        <label className="block text-sm font-medium">상태</label>
        <select
          name="status"
          defaultValue={request.status}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {REQUEST_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">운영자 메모 (선택, 고객에게 노출됨)</label>
        <textarea
          name="adminNote"
          defaultValue={request.adminNote ?? ""}
          rows={3}
          placeholder="예: 입금 확인 완료, 배송 예정일 안내 등"
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
