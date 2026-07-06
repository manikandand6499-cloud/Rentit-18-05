-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyView" DROP CONSTRAINT "PropertyView_propertyId_fkey";

-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "isSoldOut" BOOLEAN DEFAULT false,
ADD COLUMN     "soldOutAt" TIMESTAMP(3),
ADD COLUMN     "soldOutReason" TEXT,
ADD COLUMN     "viewscount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Commercial" ADD COLUMN     "isSoldOut" BOOLEAN DEFAULT false,
ADD COLUMN     "soldOutAt" TIMESTAMP(3),
ADD COLUMN     "soldOutReason" TEXT,
ADD COLUMN     "viewscount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Flatmate" ADD COLUMN     "isSoldOut" BOOLEAN DEFAULT false,
ADD COLUMN     "soldOutAt" TIMESTAMP(3),
ADD COLUMN     "soldOutReason" TEXT,
ADD COLUMN     "viewscount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "apartmentId" INTEGER,
ADD COLUMN     "commercialId" INTEGER;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "availabilityDay" JSONB,
ADD COLUMN     "availableAllDay" BOOLEAN,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "isSoldOut" BOOLEAN DEFAULT false,
ADD COLUMN     "propertyType2" TEXT,
ADD COLUMN     "soldOutAt" TIMESTAMP(3),
ADD COLUMN     "soldOutReason" TEXT,
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "viewscount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "propertyType" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'booking',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpSession" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");

-- CreateIndex
CREATE INDEX "OtpSession_mobile_idx" ON "OtpSession"("mobile");

-- CreateIndex
CREATE INDEX "OtpSession_createdAt_idx" ON "OtpSession"("createdAt");

-- CreateIndex
CREATE INDEX "PropertyView_propertyId_idx" ON "PropertyView"("propertyId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commercialId_fkey" FOREIGN KEY ("commercialId") REFERENCES "Commercial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyView" ADD CONSTRAINT "PropertyView_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
