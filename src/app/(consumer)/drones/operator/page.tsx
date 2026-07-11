import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import {
  DRONE_OPERATOR_STATUS_LABEL,
  DRONE_OPERATOR_STATUS_VARIANT,
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
  formatDate,
  formatPrice,
} from "@/lib/format";
import { DroneOperatorApplyForm } from "@/components/DroneOperatorApplyForm";
import { assignOperator } from "@/lib/actions/droneReservation";

export default async function DroneOperatorPage() {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect("/login?callbackUrl=/drones/operator");
  }

  const operator = await prisma.droneOperator.findUnique({
    where: { userId: session.user.id },
  });

  if (!operator) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
        <h1 className="text-2xl font-bold">드론 방제사 신청</h1>
        <p className="mt-1 text-sm text-black/50 dark:text-white/50">
          방제사로 활동하시려면 먼저 신청해주세요. 관리자 승인 후 배정 가능한 작업을 받을 수
          있어요.
        </p>
        <div className="mt-6">
          <DroneOperatorApplyForm />
        </div>
      </div>
    );
  }

  if (operator.status !== "APPROVED") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Badge variant={DRONE_OPERATOR_STATUS_VARIANT[operator.status]}>
          {DRONE_OPERATOR_STATUS_LABEL[operator.status]}
        </Badge>
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">
          {operator.status === "PENDING"
            ? "관리자 승인을 기다리고 있습니다."
            : "방제사로 활동할 수 없는 상태입니다. 문의가 필요하면 관리자에게 연락해주세요."}
        </p>
      </div>
    );
  }

  const [availableJobs, myJobs] = await Promise.all([
    prisma.droneReservation.findMany({
      where: { status: "PAID", operatorId: null },
      orderBy: { createdAt: "asc" },
    }),
    prisma.droneReservation.findMany({
      where: { operatorId: operator.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">방제사 작업 관리</h1>

      <h2 className="mt-8 text-lg font-semibold">배정 가능한 작업</h2>
      {availableJobs.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">
          현재 배정 가능한 작업이 없습니다.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {availableJobs.map((job) => (
            <li
              key={job.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 dark:border-white/10"
            >
              <div>
                <p className="text-xs text-black/50 dark:text-white/50">
                  {job.region}
                  {job.regionDetail ? ` ${job.regionDetail}` : ""} · {formatDate(job.desiredDate)}
                </p>
                <p className="mt-1 font-medium">
                  {job.cropType} · {job.areaPyeong}평
                </p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {formatPrice(job.totalPrice)}
                </p>
              </div>
              <form action={assignOperator.bind(null, job.id)}>
                <button
                  type="submit"
                  className="rounded-md bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800"
                >
                  수락하기
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-lg font-semibold">내 작업</h2>
      {myJobs.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">아직 배정받은 작업이 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {myJobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/drones/operator/${job.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 hover:border-brand-600 dark:border-white/10"
              >
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {job.region}
                    {job.regionDetail ? ` ${job.regionDetail}` : ""} · {formatDate(job.desiredDate)}
                  </p>
                  <p className="mt-1 font-medium">
                    {job.cropType} · {job.areaPyeong}평
                  </p>
                </div>
                <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[job.status]}>
                  {DRONE_RESERVATION_STATUS_LABEL[job.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
