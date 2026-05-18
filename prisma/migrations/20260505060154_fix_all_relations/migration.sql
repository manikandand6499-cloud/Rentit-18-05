/*
  Warnings:

  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_userId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyView" DROP CONSTRAINT "PropertyView_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_propertyId_fkey";

-- DropTable
DROP TABLE "Property";

-- CreateTable
CREATE TABLE "PGDetails" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "street" TEXT,
    "landmark" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "propertyName" TEXT,
    "propertyType" TEXT NOT NULL,
    "roomType" JSONB,
    "foodIncluded" BOOLEAN,
    "foodType" JSONB,
    "pgAmenities" JSONB,
    "parking" TEXT,
    "availableFrom" TIMESTAMP(3),
    "noticePeriod" INTEGER,
    "gateClosingTime" TIMESTAMP(3),
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "video" TEXT,
    "contactName" TEXT,
    "mobileNo" TEXT,
    "whatsapp" BOOLEAN,
    "whatsappupdates" BOOLEAN,
    "preferredTenant" JSONB,
    "preferredGuests" JSONB,
    "restrictions" JSONB,
    "propertyDescription" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PGDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PGDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PGDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PGDetails" ADD CONSTRAINT "PGDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyView" ADD CONSTRAINT "PropertyView_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PGDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PGDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
