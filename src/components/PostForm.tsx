"use client";

import { useActionState } from "react";
import type { Post, PostType } from "@prisma/client";

export type PostActionState = {
  errors?: Record<string, string[] | undefined>;
};

const initialState: PostActionState = {};

export function PostForm({
  action,
  post,
  allowedTypes,
  defaultType,
  priceLabel = "가격 (원)",
  unitLabel = "단위",
  unitPlaceholder = "kg, 박스, 개 등",
  categoryLabel = "카테고리",
  categoryPlaceholder = "과일, 채소, 곡물 등",
}: {
  action: (state: PostActionState, formData: FormData) => Promise<PostActionState>;
  post?: Post;
  allowedTypes: { value: PostType; label: string }[];
  defaultType?: PostType;
  priceLabel?: string;
  unitLabel?: string;
  unitPlaceholder?: string;
  categoryLabel?: string;
  categoryPlaceholder?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {allowedTypes.length > 1 ? (
        <div>
          <label className="block text-sm font-medium">글 종류</label>
          <select
            name="postType"
            defaultValue={post?.postType ?? defaultType}
            className={fieldClass}
          >
            {allowedTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input
          type="hidden"
          name="postType"
          value={post?.postType ?? defaultType ?? allowedTypes[0].value}
        />
      )}

      <div>
        <label className="block text-sm font-medium">제목</label>
        <input name="title" defaultValue={post?.title} className={fieldClass} />
        {state.errors?.title && <p className="mt-1 text-xs text-red-600">{state.errors.title[0]}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">{categoryLabel} (선택)</label>
          <input
            name="category"
            defaultValue={post?.category ?? ""}
            placeholder={categoryPlaceholder}
            className={fieldClass}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">{unitLabel} (선택)</label>
          <input
            name="unit"
            defaultValue={post?.unit ?? ""}
            placeholder={unitPlaceholder}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">{priceLabel} (선택, 협의 가능시 비워두세요)</label>
        <input
          type="number"
          name="price"
          min={0}
          defaultValue={post?.price ?? undefined}
          className={fieldClass}
        />
        {state.errors?.price && <p className="mt-1 text-xs text-red-600">{state.errors.price[0]}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">지역 (시/도)</label>
          <input name="region" defaultValue={post?.region} className={fieldClass} />
          {state.errors?.region && (
            <p className="mt-1 text-xs text-red-600">{state.errors.region[0]}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">상세지역 (선택)</label>
          <input name="regionDetail" defaultValue={post?.regionDetail ?? ""} className={fieldClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">설명 (선택)</label>
        <textarea
          name="description"
          defaultValue={post?.description ?? ""}
          rows={4}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">이미지 URL (선택)</label>
        <input name="imageUrl" defaultValue={post?.imageUrl ?? ""} className={fieldClass} />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-xs text-red-600">{state.errors.imageUrl[0]}</p>
        )}
      </div>

      {post && (
        <div>
          <label className="block text-sm font-medium">상태</label>
          <select name="status" defaultValue={post.status} className={fieldClass}>
            <option value="OPEN">진행중</option>
            <option value="CLOSED">마감</option>
          </select>
        </div>
      )}

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
