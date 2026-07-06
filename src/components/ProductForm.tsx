"use client";

import { useActionState } from "react";
import type { Farm, Product } from "@prisma/client";
import type { ProductActionState } from "@/app/admin/products/actions";

const initialState: ProductActionState = {};

export function ProductForm({
  action,
  product,
  farms,
}: {
  action: (state: ProductActionState, formData: FormData) => Promise<ProductActionState>;
  product?: Product;
  farms: Farm[];
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium">농가</label>
        <select
          name="farmId"
          defaultValue={product?.farmId ?? ""}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          <option value="" disabled>
            농가 선택
          </option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name}
            </option>
          ))}
        </select>
        {state.errors?.farmId && <p className="mt-1 text-xs text-red-600">{state.errors.farmId[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">상품 이름</label>
        <input
          name="name"
          defaultValue={product?.name}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">카테고리</label>
          <input
            name="category"
            defaultValue={product?.category}
            placeholder="과일, 채소, 곡물 등"
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
          {state.errors?.category && (
            <p className="mt-1 text-xs text-red-600">{state.errors.category[0]}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">단위</label>
          <input
            name="unit"
            defaultValue={product?.unit}
            placeholder="kg, 박스, 개 등"
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
          {state.errors?.unit && <p className="mt-1 text-xs text-red-600">{state.errors.unit[0]}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">가격 (원)</label>
        <input
          type="number"
          name="price"
          min={0}
          defaultValue={product?.price}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.price && <p className="mt-1 text-xs text-red-600">{state.errors.price[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">판매 상태</label>
        <select
          name="stockStatus"
          defaultValue={product?.stockStatus ?? "AVAILABLE"}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        >
          <option value="AVAILABLE">판매중</option>
          <option value="SOLD_OUT">품절</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">설명 (선택)</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">이미지 URL (선택)</label>
        <input
          name="imageUrl"
          defaultValue={product?.imageUrl ?? ""}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-xs text-red-600">{state.errors.imageUrl[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}
