import { toggleFavoriteAction } from "@/lib/actions/favorite";
import { HeartIcon } from "@/components/icons/NavIcons";

export function FavoriteButton({
  postId,
  isFavorited,
  redirectTo,
  size = "md",
  variant = "overlay",
}: {
  postId: string;
  isFavorited: boolean;
  redirectTo: string;
  size?: "sm" | "md";
  /** overlay: 사진 위에 겹치는 카드용(어두운 반투명). inline: 흰 배경 위 본문용(테두리). */
  variant?: "overlay" | "inline";
}) {
  const dimension = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const variantClass =
    variant === "overlay"
      ? "bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
      : "border border-black/10 text-black/60 hover:border-red-300 hover:text-red-500 dark:border-white/10 dark:text-white/60";

  return (
    <form action={toggleFavoriteAction.bind(null, postId, redirectTo)}>
      <button
        type="submit"
        aria-label={isFavorited ? "찜 해제" : "찜하기"}
        onClick={(e) => e.stopPropagation()}
        className={`flex ${dimension} items-center justify-center rounded-full transition ${variantClass} ${
          isFavorited && variant === "inline" ? "text-red-500" : ""
        }`}
      >
        <HeartIcon filled={isFavorited} className={iconSize} />
      </button>
    </form>
  );
}
