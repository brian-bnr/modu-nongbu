-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'credentials',
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "passwordHash" DROP NOT NULL;
