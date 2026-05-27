-- CreateTable
CREATE TABLE "Flatmate" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "apartmentType" TEXT,
    "apartmentName" TEXT,
    "bhkType" TEXT,
    "floor" TEXT,
    "totalFloor" TEXT,
    "roomType" TEXT,
    "tenantType" TEXT,
    "propertyAge" TEXT,
    "facing" TEXT,
    "builtUpArea" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flatmate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flatmate" ADD CONSTRAINT "Flatmate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
