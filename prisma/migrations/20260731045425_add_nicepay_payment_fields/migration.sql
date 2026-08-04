-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "additionalPgOrderId" TEXT,
ADD COLUMN     "additionalPgTransactionId" TEXT,
ADD COLUMN     "pgOrderId" TEXT;
