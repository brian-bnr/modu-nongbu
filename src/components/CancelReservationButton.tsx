"use client";

export function CancelReservationButton({
  reservationId,
  action,
}: {
  reservationId: string;
  action: (reservationId: string) => Promise<void>;
}) {
  return (
    <form action={action.bind(null, reservationId)}>
      <button
        type="submit"
        onClick={(e) => {
          if (!window.confirm("정말 취소하시겠습니까? 진행 단계에 따라 취소수수료가 부과될 수 있습니다.")) {
            e.preventDefault();
          }
        }}
        className="w-full rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
      >
        예약 취소
      </button>
    </form>
  );
}
