/*
  Warnings:

  - You are about to drop the column `propertyType2` on the `Commercial` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Commercial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commercial" DROP COLUMN "propertyType2",
DROP COLUMN "updatedAt",
ADD COLUMN     "commercialPropertyType" TEXT;
