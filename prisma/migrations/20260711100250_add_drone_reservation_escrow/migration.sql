-- CreateEnum
CREATE TYPE "DroneOperatorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DroneReservationStatus" AS ENUM ('REQUESTED', 'PAID', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETION_REQUESTED', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('HELD', 'RELEASED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED');

-- CreateTable
CREATE TABLE "DroneOperator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DroneOperatorStatus" NOT NULL DEFAULT 'PENDING',
    "equipmentInfo" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DroneOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DroneReservation" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "operatorId" TEXT,
    "status" "DroneReservationStatus" NOT NULL DEFAULT 'REQUESTED',
    "region" TEXT NOT NULL,
    "regionDetail" TEXT,
    "areaPyeong" INTEGER NOT NULL,
    "cropType" TEXT NOT NULL,
    "desiredDate" TIMESTAMP(3) NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "startLat" DOUBLE PRECISION,
    "startLng" DOUBLE PRECISION,
    "endedAt" TIMESTAMP(3),
    "endLat" DOUBLE PRECISION,
    "endLng" DOUBLE PRECISION,
    "completionRequestedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DroneReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DroneWorkPhoto" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DroneWorkPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'HELD',
    "isMock" BOOLEAN NOT NULL DEFAULT true,
    "pgTransactionId" TEXT,
    "refundAmount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "commissionRate" INTEGER NOT NULL,
    "commissionAmount" INTEGER NOT NULL,
    "payoutAmount" INTEGER NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "raisedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" TEXT NOT NULL,
    "droneUnitPrice" INTEGER NOT NULL DEFAULT 3000,
    "droneCommissionRate" INTEGER NOT NULL DEFAULT 10,
    "droneCancelFeeRate" INTEGER NOT NULL DEFAULT 20,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DroneOperator_userId_key" ON "DroneOperator"("userId");

-- CreateIndex
CREATE INDEX "DroneOperator_status_idx" ON "DroneOperator"("status");

-- CreateIndex
CREATE INDEX "DroneReservation_farmerId_idx" ON "DroneReservation"("farmerId");

-- CreateIndex
CREATE INDEX "DroneReservation_operatorId_idx" ON "DroneReservation"("operatorId");

-- CreateIndex
CREATE INDEX "DroneReservation_status_idx" ON "DroneReservation"("status");

-- CreateIndex
CREATE INDEX "DroneWorkPhoto_reservationId_idx" ON "DroneWorkPhoto"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reservationId_key" ON "Payment"("reservationId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_paymentId_key" ON "Settlement"("paymentId");

-- CreateIndex
CREATE INDEX "Settlement_status_idx" ON "Settlement"("status");

-- CreateIndex
CREATE INDEX "Settlement_operatorId_idx" ON "Settlement"("operatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Dispute_reservationId_key" ON "Dispute"("reservationId");

-- CreateIndex
CREATE INDEX "Dispute_status_idx" ON "Dispute"("status");

-- AddForeignKey
ALTER TABLE "DroneOperator" ADD CONSTRAINT "DroneOperator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DroneReservation" ADD CONSTRAINT "DroneReservation_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DroneReservation" ADD CONSTRAINT "DroneReservation_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "DroneOperator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DroneWorkPhoto" ADD CONSTRAINT "DroneWorkPhoto_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "DroneReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "DroneReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "DroneOperator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "DroneReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
