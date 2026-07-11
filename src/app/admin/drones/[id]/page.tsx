import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
  PAYMENT_STATUS_LABEL,
  DISPUTE_STATUS_LABEL,
  DISPUTE_STATUS_VARIANT,
  formatDate,
  formatPrice,
} from "@/lib/format";
import { DroneAdminNoteForm } from "@/components/DroneAdminNoteForm";
import { DisputeResolveForm } from "@/components/DisputeResolveForm";

export default async function AdminDroneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reservation = await prisma.droneReservation.findUnique({
    where: { id },
    include: {
      farmer: true,
      operator: { include: { user: true } },
      payment: { include: { settlement: true } },
      photos: true,
      dispute: true,
    },
  });

  if (!reservation) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/drones" className="text-sm text-brand-700 hover:underline dark:text-brand-400">
        ← 드론 예약 목록으로
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">드론 예약 상세</h1>
        <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[reservation.status]}>
          {DRONE_RESERVATION_STATUS_LABEL[reservation.status]}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <p>
          농민: {reservation.farmer.name} ({[reservation.farmer.email, reservation.farmer.phone].filter(Boolean).join(" · ")})
        </p>
        {reservation.operator && (
          <p>
            방제사: {reservation.operator.user.name} ({reservation.operator.user.email})
          </p>
        )}
        {reservation.parcelJibun && <p>필지: {reservation.parcelJibun}</p>}
        <p>
          {reservation.region}
          {reservation.regionDetail ? ` ${reservation.regionDetail}` : ""} · {reservation.cropType} ·{" "}
          신청 {reservation.areaPyeong}평
          {reservation.actualAreaPyeong != null && ` / 실제 ${reservation.actualAreaPyeong}평`}
        </p>
        <p>희망 작업일: {formatDate(reservation.desiredDate)}</p>
        <p>결제 금액: {formatPrice(reservation.totalPrice)}</p>
        {reservation.payment && (
          <>
            <p>결제 상태: {PAYMENT_STATUS_LABEL[reservation.payment.status]}</p>
            {reservation.payment.additionalAmount !== 0 && (
              <p>
                면적 차액 정산:{" "}
                {reservation.payment.additionalAmount > 0
                  ? `추가청구 ${formatPrice(reservation.payment.additionalAmount)} (${reservation.payment.additionalPaid ? "결제완료" : "미결제"})`
                  : `차감(환불) ${formatPrice(-reservation.payment.additionalAmount)}`}
              </p>
            )}
          </>
        )}
        {reservation.startedAt && (
          <p>
            작업 시작: {formatDate(reservation.startedAt)}
            {reservation.startLat != null && ` (${reservation.startLat.toFixed(5)}, ${reservation.startLng?.toFixed(5)})`}
          </p>
        )}
        {reservation.endedAt && (
          <p>
            작업 종료: {formatDate(reservation.endedAt)}
            {reservation.endLat != null && ` (${reservation.endLat.toFixed(5)}, ${reservation.endLng?.toFixed(5)})`}
          </p>
        )}
        {reservation.cancelReason && <p>취소 사유: {reservation.cancelReason}</p>}
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
                className="h-24 w-24 rounded-md border border-black/10 object-cover dark:border-white/20"
              />
            ))}
          </div>
        </div>
      )}

      {reservation.dispute && (
        <div className="mt-6 rounded-lg border border-amber-200 p-4 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">분쟁 접수</p>
            <Badge variant={DISPUTE_STATUS_VARIANT[reservation.dispute.status]}>
              {DISPUTE_STATUS_LABEL[reservation.dispute.status]}
            </Badge>
          </div>
          <p className="mt-2 text-sm">{reservation.dispute.reason}</p>
          {reservation.dispute.status !== "RESOLVED" ? (
            <div className="mt-4">
              <DisputeResolveForm
                disputeId={reservation.dispute.id}
                reservationId={reservation.id}
                resolution={reservation.dispute.resolution}
              />
            </div>
          ) : (
            reservation.dispute.resolution && (
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">
                처리 결과: {reservation.dispute.resolution}
              </p>
            )
          )}
        </div>
      )}

      <div className="mt-6 max-w-lg">
        <DroneAdminNoteForm reservationId={reservation.id} adminNote={reservation.adminNote} />
      </div>
    </div>
  );
}
