import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DroneOperatorJobPanel } from "@/components/DroneOperatorJobPanel";

export default async function DroneOperatorJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect(`/login?callbackUrl=/drones/operator/${id}`);
  }

  const operator = await prisma.droneOperator.findUnique({
    where: { userId: session.user.id },
  });
  if (!operator) {
    notFound();
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id },
    include: { photos: { orderBy: { createdAt: "asc" } } },
  });

  if (!reservation || reservation.operatorId !== operator.id) {
    notFound();
  }

  return <DroneOperatorJobPanel reservation={reservation} photos={reservation.photos} />;
}
