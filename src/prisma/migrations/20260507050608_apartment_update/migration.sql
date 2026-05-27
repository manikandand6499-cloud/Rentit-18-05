/*
  Warnings:

  - You are about to drop the column `apartmentType` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `availableFrom` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `expectedRent` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `maintenance` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `maintenanceAmount` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `parking` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `preferredTenant` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `rentNegotiable` on the `Apartment` table. All the data in the column will be lost.
  - You are about to drop the column `rentType` on the `Apartment` table. All the data in the column will be lost.
  - The `furnishing` column on the `Apartment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Commercial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Commercial" DROP CONSTRAINT "Commercial_userId_fkey";

-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "apartmentType",
DROP COLUMN "availableFrom",
DROP COLUMN "deposit",
DROP COLUMN "description",
DROP COLUMN "expectedRent",
DROP COLUMN "maintenance",
DROP COLUMN "maintenanceAmount",
DROP COLUMN "parking",
DROP COLUMN "preferredTenant",
DROP COLUMN "rentNegotiable",
DROP COLUMN "rentType",
ADD COLUMN     "apartmentType" TEXT,
ADD COLUMN     "otherFeatures" JSONB,
DROP COLUMN "furnishing",
ADD COLUMN     "furnishing" JSONB;

-- DropTable
DROP TABLE "Commercial";
