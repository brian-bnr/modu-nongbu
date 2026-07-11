import Link from "next/link";
import type { DroneReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
  formatDate,
  formatPrice,
} from "@/lib/format";

const STATUS_OPTIONS: DroneReservationStatus[] = [
  "REQUESTED",
  "PAID",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETION_REQUESTED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
];

export default async function AdminDronesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus =
    status && STATUS_OPTIONS.includes(status as DroneReservationStatus)
      ? (status as DroneReservationStatus)
      : undefined;

  const reservations = await prisma.droneReservation.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { farmer: true, operator: { include: { user: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">드론 예약 관리</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/drones"
          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
            !activeStatus
              ? "bg-brand-700 text-white"
              : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
          }`}
        >
          전체
        </Link>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/drones?status=${s}`}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
              activeStatus === s
                ? "bg-brand-700 text-white"
                : "bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/10 dark:text-white/60"
            }`}
          >
            {DRONE_RESERVATION_STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      {reservations.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">해당하는 예약이 없습니다.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <Link
                href={`/admin/drones/${reservation.id}`}
                className="flex h-full flex-col justify-between gap-2 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">
                    {reservation.cropType} · {reservation.areaPyeong}평
                  </p>
                  <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[reservation.status]}>
                    {DRONE_RESERVATION_STATUS_LABEL[reservation.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {reservation.farmer.name} · {formatPrice(reservation.totalPrice)}
                  </p>
                  {reservation.operator && (
                    <p className="text-xs text-black/40 dark:text-white/40">
                      방제사: {reservation.operator.user.name}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-black/40 dark:text-white/40">
                    {formatDate(reservation.createdAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
