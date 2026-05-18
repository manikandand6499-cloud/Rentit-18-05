-- AlterTable
ALTER TABLE "Flatmate" ADD COLUMN     "availabilityDay" JSONB,
ADD COLUMN     "availableAllDay" BOOLEAN,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "video" TEXT;
