-- AlterTable
ALTER TABLE "Commercial" ADD COLUMN     "addOthertags" TEXT,
ADD COLUMN     "depositNegotiable" BOOLEAN,
ADD COLUMN     "idealFor" JSONB,
ADD COLUMN     "leaseDuration" TEXT,
ADD COLUMN     "lockinPeriod" TEXT,
ADD COLUMN     "maintenanceExtra" BOOLEAN;
