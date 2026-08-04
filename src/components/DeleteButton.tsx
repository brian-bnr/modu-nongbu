"use client";

export function DeleteButton({
  label = "삭제",
  confirmText = "정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
}: {
  label?: string;
  confirmText?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      className="text-sm text-red-600 hover:underline"
    >
      {label}
    </button>
  );
}
