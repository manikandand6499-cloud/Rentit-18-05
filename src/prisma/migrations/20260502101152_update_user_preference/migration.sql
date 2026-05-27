/*
  Warnings:

  - The `status` column on the `Visit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('pending', 'confirmed', 'calling', 'cancelled', 'completed');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "area" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "locality" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "isCalled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visitDateTime" TIMESTAMP(3),
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "time" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "VisitStatus" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT,
    "locality" TEXT,
    "search" TEXT,
    "pgFor" TEXT,
    "sharingTypes" JSONB,
    "preferredTenant" TEXT,
    "availability" TEXT,
    "parking" TEXT,
    "foodIncluded" BOOLEAN,
    "rentMin" INTEGER,
    "rentMax" INTEGER,
    "amenities" JSONB,
    "nearby" JSONB,
    "restrictions" JSONB,
    "premiumSort" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyView" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserPreference_userId_idx" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "UserPreference_userId_createdAt_idx" ON "UserPreference"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyView_userId_propertyId_key" ON "PropertyView"("userId", "propertyId");

-- CreateIndex
CREATE INDEX "Message_propertyId_idx" ON "Message"("propertyId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Visit_userId_idx" ON "Visit"("userId");

-- CreateIndex
CREATE INDEX "Visit_propertyId_idx" ON "Visit"("propertyId");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "Visit"("status");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyView" ADD CONSTRAINT "PropertyView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyView" ADD CONSTRAINT "PropertyView_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
