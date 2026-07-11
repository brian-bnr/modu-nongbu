import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
  PAYMENT_STATUS_LABEL,
  formatDate,
  formatPrice,
} from "@/lib/format";
import {
  mockPayReservation,
  cancelReservation,
  approveCompletion,
} from "@/lib/actions/droneReservation";
import { CancelReservationButton } from "@/components/CancelReservationButton";

export default async function DroneReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect(`/login?callbackUrl=/drones/${id}`);
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id },
    include: {
      payment: true,
      photos: { orderBy: { createdAt: "asc" } },
      operator: { include: { user: true } },
    },
  });

  if (!reservation || reservation.farmerId !== session.user.id) {
    notFound();
  }

  const canCancel = ["REQUESTED", "PAID", "ASSIGNED"].includes(reservation.status);

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">드론 방제 예약 상세</h1>
        <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[reservation.status]}>
          {DRONE_RESERVATION_STATUS_LABEL[reservation.status]}
        </Badge>
      </div>

      <div className="mt-6 space-y-3 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">지역</span>
          <span>
            {reservation.region}
            {reservation.regionDetail ? ` ${reservation.regionDetail}` : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">작물</span>
          <span>{reservation.cropType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">면적</span>
          <span>{reservation.areaPyeong}평</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">희망 작업일</span>
          <span>{formatDate(reservation.desiredDate)}</span>
        </div>
        <div className="flex justify-between border-t border-black/10 pt-3 font-medium dark:border-white/10">
          <span>결제 금액</span>
          <span>{formatPrice(reservation.totalPrice)}</span>
        </div>
        {reservation.payment && (
          <div className="flex justify-between text-xs text-black/40 dark:text-white/40">
            <span>결제 상태</span>
            <span>{PAYMENT_STATUS_LABEL[reservation.payment.status]}</span>
          </div>
        )}
        {reservation.operator && (
          <div className="flex justify-between border-t border-black/10 pt-3 dark:border-white/10">
            <span className="text-black/50 dark:text-white/50">배정 방제사</span>
            <span>{reservation.operator.user.name}</span>
          </div>
        )}
      </div>

      {reservation.photos.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium">작업 사진</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {reservation.photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.url}
                alt=""
                className="h-20 w-20 rounded-md border border-black/10 object-cover dark:border-white/20"
              />
            ))}
          </div>
        </div>
      )}

      {reservation.status === "REQUESTED" && (
        <form action={mockPayReservation.bind(null, reservation.id)} className="mt-6">
          <div className="mb-3 rounded-lg bg-brand-50 p-3 text-xs text-black/60 dark:bg-brand-900/20 dark:text-white/60">
            결제하시면 대금은 에스크로(구매안전서비스)에 보관되며, 방제사 배정 후 작업이
            완료되고 승인하시면 정산됩니다.
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            {formatPrice(reservation.totalPrice)} 결제하기
          </button>
        </form>
      )}

      {reservation.status === "COMPLETION_REQUESTED" && (
        <form action={approveCompletion.bind(null, reservation.id)} className="mt-6">
          <div className="mb-3 rounded-lg bg-brand-50 p-3 text-xs text-black/60 dark:bg-brand-900/20 dark:text-white/60">
            방제사가 작업을 완료 처리했습니다. 확인 후 승인해주세요 (승인하지 않아도 일정 시간
            후 자동으로 승인되어 정산이 진행됩니다).
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            작업 완료 승인
          </button>
        </form>
      )}

      {canCancel && (
        <div className="mt-4">
          <CancelReservationButton reservationId={reservation.id} action={cancelReservation} />
        </div>
      )}
    </div>
  );
}
