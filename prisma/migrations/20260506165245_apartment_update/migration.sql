/*
  Warnings:

  - You are about to drop the column `propertyType` on the `Apartment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "propertyType",
ADD COLUMN     "propertyType2" TEXT;
