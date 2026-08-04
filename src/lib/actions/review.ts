"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ReviewActionState = {
  status: "idle" | "error" | "success";
  error?: string;
};

export async function submitOperatorReview(
  reservationId: string,
  _prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return { status: "error", error: "로그인이 필요합니다." };
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { review: true },
  });

  if (!reservation || reservation.farmerId !== session.user.id) {
    return { status: "error", error: "예약을 찾을 수 없습니다." };
  }
  if (reservation.status !== "COMPLETED" || !reservation.operatorId) {
    return { status: "error", error: "완료된 작업만 리뷰를 남길 수 있습니다." };
  }
  if (reservation.review) {
    return { status: "error", error: "이미 리뷰를 작성했습니다." };
  }

  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", error: "별점을 선택해주세요." };
  }
  const comment = String(formData.get("comment") ?? "").trim();

  await prisma.review.create({
    data: {
      reservationId: reservation.id,
      operatorId: reservation.operatorId,
      farmerId: session.user.id,
      rating,
      comment: comment || null,
    },
  });

  revalidatePath(`/drones/${reservationId}`);
  revalidatePath(`/drones/operators/${reservation.operatorId}`);
  revalidatePath("/drones/operators");
  revalidatePath("/");

  return { status: "success" };
}
