-- AlterTable
ALTER TABLE "DroneReservation" ADD COLUMN     "actualAreaPyeong" INTEGER,
ADD COLUMN     "parcelAreaSqm" DOUBLE PRECISION,
ADD COLUMN     "parcelJibun" TEXT,
ADD COLUMN     "parcelPnu" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "additionalAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "additionalPaid" BOOLEAN NOT NULL DEFAULT false;
