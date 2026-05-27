-- CreateTable
CREATE TABLE "Commercial" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "locality" TEXT,
    "street" TEXT,
    "landmark" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "propertyType2" TEXT,
    "propertyType" TEXT,
    "buildingType" TEXT,
    "propertyAge" TEXT,
    "floor" INTEGER,
    "totalFloor" INTEGER,
    "builtUpArea" INTEGER,
    "furnishing" JSONB,
    "otherFeatures" JSONB,
    "rentType" TEXT,
    "expectedRent" INTEGER,
    "deposit" INTEGER,
    "maintenanceAmount" INTEGER,
    "maintenance" TEXT,
    "rentNegotiable" BOOLEAN,
    "availableFrom" TEXT,
    "contactName" TEXT,
    "mobileNo" TEXT,
    "whatsapp" BOOLEAN,
    "description" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commercial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commercial" ADD CONSTRAINT "Commercial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
