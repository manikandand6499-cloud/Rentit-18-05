/*
  Warnings:

  - The `expectedRent` column on the `Apartment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deposit` column on the `Apartment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maintenanceAmount` column on the `Apartment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `preferredTenant` column on the `Apartment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Apartment" ALTER COLUMN "furnishing" SET DATA TYPE TEXT,
DROP COLUMN "expectedRent",
ADD COLUMN     "expectedRent" INTEGER,
ALTER COLUMN "availableFrom" SET DATA TYPE TEXT,
DROP COLUMN "deposit",
ADD COLUMN     "deposit" INTEGER,
DROP COLUMN "maintenanceAmount",
ADD COLUMN     "maintenanceAmount" INTEGER,
DROP COLUMN "preferredTenant",
ADD COLUMN     "preferredTenant" TEXT[];

-- CreateTable
CREATE TABLE "Commercial" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "locality" TEXT,
    "street" TEXT,
    "landmark" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "propertyType2" TEXT,
    "propertyType" TEXT,
    "buildingType" TEXT,
    "propertyAge" TEXT,
    "floor" INTEGER,
    "totalFloor" INTEGER,
    "builtUpArea" INTEGER,
    "furnishing" JSONB,
    "otherFeatures" JSONB,
    "rentType" TEXT,
    "expectedRent" INTEGER,
    "deposit" INTEGER,
    "maintenanceAmount" INTEGER,
    "maintenance" TEXT,
    "rentNegotiable" BOOLEAN,
    "depositNegotiable" BOOLEAN,
    "maintenanceExtra" BOOLEAN,
    "leaseDuration" TEXT,
    "lockinPeriod" TEXT,
    "availableFrom" TEXT,
    "idealFor" JSONB,
    "addOthertags" TEXT,
    "contactName" TEXT,
    "mobileNo" TEXT,
    "whatsapp" BOOLEAN,
    "images" TEXT[],
    "video" TEXT,
    "description" TEXT,
    "availabilityDay" JSONB,
    "startTime" TEXT,
    "endTime" TEXT,
    "availableAllDay" BOOLEAN,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commercial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commercial" ADD CONSTRAINT "Commercial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
