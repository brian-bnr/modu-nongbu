-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FARMER', 'OPERATOR', 'EXPERT', 'COMPANY');

-- CreateEnum
CREATE TYPE "ExpertSpecialty" AS ENUM ('DISTRIBUTION', 'SUPPLIES', 'OTHER');

-- AlterTable
ALTER TABLE "DroneOperator" ADD COLUMN     "activityRegion" TEXT,
ADD COLUMN     "droneModel" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasPaddyField" BOOLEAN,
ADD COLUMN     "hasUplandField" BOOLEAN,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FARMER';

-- CreateTable
CREATE TABLE "ExpertProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialty" "ExpertSpecialty" NOT NULL,
    "activityRegion" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpertProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyType" TEXT NOT NULL,
    "mainItem" TEXT,
    "activityRegion" TEXT,
    "businessInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpertProfile_userId_key" ON "ExpertProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "CompanyProfile"("userId");

-- AddForeignKey
ALTER TABLE "ExpertProfile" ADD CONSTRAINT "ExpertProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
