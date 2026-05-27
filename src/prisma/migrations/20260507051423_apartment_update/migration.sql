/*
  Warnings:

  - You are about to drop the column `ApartmentType` on the `Apartment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "apartmentType",
ADD COLUMN     "apartmentType" TEXT,
ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "deposit" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "maintenance" TEXT,
ADD COLUMN     "maintenanceAmount" TEXT,
ADD COLUMN     "parking" TEXT,
ADD COLUMN     "preferredTenant" TEXT,
ADD COLUMN     "rentNegotiable" BOOLEAN;
