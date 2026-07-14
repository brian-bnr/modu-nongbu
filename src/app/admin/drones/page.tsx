import type { DroneReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { PageIntro, StatTile, SectionCard, GridCard, FilterPill } from "@/components/admin/AdminUI";
import { requireAdmin } from "@/lib/auth";
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

const IN_PROGRESS_STATUSES: DroneReservationStatus[] = ["REQUESTED", "PAID", "ASSIGNED", "IN_PROGRESS"];

export default async function AdminDronesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();

  const { status } = await searchParams;
  const activeStatus =
    status && STATUS_OPTIONS.includes(status as DroneReservationStatus)
      ? (status as DroneReservationStatus)
      : undefined;

  const [reservations, totalCount, inProgressCount, completedCount] = await Promise.all([
    prisma.droneReservation.findMany({
      where: activeStatus ? { status: activeStatus } : undefined,
      orderBy: { createdAt: "desc" },
      include: { farmer: true, operator: { include: { user: true } } },
    }),
    prisma.droneReservation.count(),
    prisma.droneReservation.count({ where: { status: { in: IN_PROGRESS_STATUSES } } }),
    prisma.droneReservation.count({ where: { status: "COMPLETED" } }),
  ]);

  return (
    <div>
      <PageIntro title="드론 예약 관리" subtitle={`전체 ${totalCount.toLocaleString("ko-KR")}건`} />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatTile label="전체 예약" value={totalCount} color="teal" delay={0} />
        <StatTile label="진행중" value={inProgressCount} color="amber" delay={40} />
        <StatTile label="완료" value={completedCount} color="green" delay={80} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterPill href="/admin/drones" active={!activeStatus}>
          전체
        </FilterPill>
        {STATUS_OPTIONS.map((s) => (
          <FilterPill key={s} href={`/admin/drones?status=${s}`} active={activeStatus === s}>
            {DRONE_RESERVATION_STATUS_LABEL[s]}
          </FilterPill>
        ))}
      </div>

      <div className="mt-6">
        <SectionCard title="예약 목록" tone="teal" delay={80}>
          {reservations.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">해당하는 예약이 없습니다.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {reservations.map((reservation, i) => (
                <GridCard key={reservation.id} href={`/admin/drones/${reservation.id}`} delay={i * 30}>
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
                </GridCard>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
