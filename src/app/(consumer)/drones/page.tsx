import Link from "next/link";
import type { DroneReservationStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
  formatDate,
  formatPrice,
} from "@/lib/format";

const VALID_STATUSES = new Set<string>(Object.keys(DRONE_RESERVATION_STATUS_LABEL));

export default async function DronesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter =
    status && VALID_STATUSES.has(status) ? (status as DroneReservationStatus) : null;

  const session = await auth();

  if (session?.user?.type !== "user") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl dark:bg-brand-900/30">
          🚁
        </div>
        <h1 className="mt-4 text-xl font-bold">드론 방제·방역</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          논·밭 병해충 방제부터 축사·시설 소독까지, 드론 기사에게 바로 예약하고 안전하게
          선결제할 수 있어요.
        </p>
        <Link
          href="/login?callbackUrl=/drones/new"
          className="mt-6 inline-block rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          로그인하고 신청하기
        </Link>
      </div>
    );
  }

  const reservations = await prisma.droneReservation.findMany({
    where: {
      farmerId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">드론 방제 예약</h1>
          {statusFilter && (
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">
              {DRONE_RESERVATION_STATUS_LABEL[statusFilter]} 상태만 보는 중 ·{" "}
              <Link href="/drones" className="text-brand-700 hover:underline dark:text-brand-400">
                전체 보기
              </Link>
            </p>
          )}
        </div>
        <Link
          href="/drones/new"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          신청하기
        </Link>
      </div>

      {reservations.length === 0 ? (
        <p className="mt-6 text-sm text-black/50 dark:text-white/50">
          {statusFilter
            ? `${DRONE_RESERVATION_STATUS_LABEL[statusFilter]} 상태의 예약이 없습니다.`
            : "아직 신청한 드론 방제 예약이 없습니다."}
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <Link
                href={`/drones/${reservation.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 hover:border-brand-600 dark:border-white/10"
              >
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {reservation.region}
                    {reservation.regionDetail ? ` ${reservation.regionDetail}` : ""} ·{" "}
                    {formatDate(reservation.createdAt)}
                  </p>
                  <p className="mt-1 font-medium">
                    {reservation.cropType} · {reservation.areaPyeong}평
                  </p>
                  <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                    {formatPrice(reservation.totalPrice)}
                  </p>
                </div>
                <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[reservation.status]}>
                  {DRONE_RESERVATION_STATUS_LABEL[reservation.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
