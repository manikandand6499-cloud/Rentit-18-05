/*
  Warnings:

  - A unique constraint covering the columns `[userId,flatmateId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_propertyId_fkey";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "flatmateId" INTEGER,
ALTER COLUMN "propertyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_flatmateId_key" ON "Like"("userId", "flatmateId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_flatmateId_fkey" FOREIGN KEY ("flatmateId") REFERENCES "Flatmate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
