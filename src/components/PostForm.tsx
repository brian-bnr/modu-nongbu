"use client";

import { useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Post, PostType } from "@prisma/client";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const REGIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

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

  const [postType, setPostType] = useState(
    post?.postType ?? defaultType ?? allowedTypes[0].value
  );
  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [unit, setUnit] = useState(post?.unit ?? "");
  const [price, setPrice] = useState(post?.price != null ? String(post.price) : "");
  const [region, setRegion] = useState(post?.region ?? "");
  const [regionDetail, setRegionDetail] = useState(post?.regionDetail ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [status, setStatus] = useState(post?.status ?? "OPEN");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError("이미지 용량은 10MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setImageUrl(blob.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {allowedTypes.length > 1 ? (
        <div>
          <label className="block text-sm font-medium">글 종류</label>
          <select
            name="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value as PostType)}
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
        <input type="hidden" name="postType" value={postType} />
      )}

      <div>
        <label className="block text-sm font-medium">제목</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={fieldClass}
        />
        {state.errors?.title && <p className="mt-1 text-xs text-red-600">{state.errors.title[0]}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">{categoryLabel} (선택)</label>
          <input
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={categoryPlaceholder}
            className={fieldClass}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">{unitLabel} (선택)</label>
          <input
            name="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={fieldClass}
        />
        {state.errors?.price && <p className="mt-1 text-xs text-red-600">{state.errors.price[0]}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">지역 (시/도)</label>
          <select
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={fieldClass}
          >
            <option value="">지역을 선택하세요</option>
            {region && !REGIONS.includes(region) && <option value={region}>{region}</option>}
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {state.errors?.region && (
            <p className="mt-1 text-xs text-red-600">{state.errors.region[0]}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">상세지역 (선택)</label>
          <input
            name="regionDetail"
            value={regionDetail}
            onChange={(e) => setRegionDetail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">설명 (선택)</label>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={fieldClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">이미지 (선택)</label>
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="mt-2 h-32 w-32 rounded-md border border-black/10 object-cover dark:border-white/20"
          />
        )}
        <div className="mt-2 flex items-center gap-3">
          <label className="cursor-pointer rounded-md border border-black/10 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
            {uploading ? "업로드 중..." : imageUrl ? "다른 사진 선택" : "사진 선택"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {imageUrl && !uploading && (
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="text-xs text-black/50 hover:underline dark:text-white/50"
            >
              제거
            </button>
          )}
        </div>
        {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
        <input type="hidden" name="imageUrl" value={imageUrl} />
        {state.errors?.imageUrl && (
          <p className="mt-1 text-xs text-red-600">{state.errors.imageUrl[0]}</p>
        )}
      </div>

      {post && (
        <div>
          <label className="block text-sm font-medium">상태</label>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "OPEN" | "CLOSED")}
            className={fieldClass}
          >
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
