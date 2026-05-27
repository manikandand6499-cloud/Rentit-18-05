-- AlterTable
ALTER TABLE "Flatmate" ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expectedDeposit" DOUBLE PRECISION,
ADD COLUMN     "expectedRent" DOUBLE PRECISION,
ADD COLUMN     "furnishing" TEXT,
ADD COLUMN     "maintenanceAmount" DOUBLE PRECISION,
ADD COLUMN     "maintenanceType" TEXT,
ADD COLUMN     "parking" TEXT;
