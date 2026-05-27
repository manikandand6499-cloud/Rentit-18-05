/*
  Warnings:

  - You are about to drop the column `ApartmentType` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `otherFeatures` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `propertyType2` on the `Apartment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "apartmentType",
DROP COLUMN "otherFeatures",
DROP COLUMN "propertyType2",
ADD COLUMN     "apartmentType" TEXT,
ADD COLUMN     "availableFrom" TEXT,
ADD COLUMN     "deposit" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expectedRent" INTEGER,
ADD COLUMN     "maintenance" TEXT,
ADD COLUMN     "maintenanceAmount" INTEGER,
ADD COLUMN     "parking" TEXT,
ADD COLUMN     "preferredTenant" TEXT[],
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "rentNegotiable" BOOLEAN,
ADD COLUMN     "rentType" TEXT,
ALTER COLUMN "furnishing" SET DATA TYPE TEXT;
