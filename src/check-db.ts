// src/check-db.ts
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const apartments = await prisma.apartment.findMany({
      select: { id: true, propertyType2: true, city: true, locality: true }
    });
    console.log('APARTMENTS:', apartments);

    const flatmates = await prisma.flatmate.findMany({
      select: { id: true, propertyType: true, city: true, locality: true }
    });
    console.log('FLATMATES:', flatmates);

    const commercials = await prisma.commercial.findMany({
      select: { id: true, propertyType: true, city: true, locality: true }
    });
    console.log('COMMERCIALS:', commercials);

    const pgs = await prisma.pGDetails.findMany({
      select: { id: true, propertyType: true, city: true, locality: true, propertyName: true }
    });
    console.log('PGS:', pgs);
  } catch (error) {
    console.error('Error fetching properties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
