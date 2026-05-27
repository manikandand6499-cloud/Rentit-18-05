/*
  Warnings:

  - You are about to drop the column `photos` on the `Apartment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Apartment" DROP COLUMN "photos",
ADD COLUMN     "availabilityDay" JSONB,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "video" TEXT;
