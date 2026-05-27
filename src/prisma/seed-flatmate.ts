// prisma/seed-flatmate.ts
//
// Run:
// npx ts-node prisma/seed-flatmate.ts
//
// Inserts 20 realistic Flatmate listings in Chennai
// for userId = 2

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const userId = 2;

async function main() {
  console.log('🌱 Seeding 20 Flatmate listings...');

  // Delete old demo records
  await prisma.flatmate.deleteMany({
    where: {
      userId,
      apartmentName: {
        startsWith: 'Demo Flatmate',
      },
    },
  });

  const locations = [
    'Pallavaram',
    'Chrompet',
    'Tambaram',
    'Velachery',
    'Koyambedu',
    'Guindy',
    'Alandur',
    'Porur',
    'Sholinganallur',
    'Perungudi',
    'T Nagar',
    'Vadapalani',
    'Anna Nagar',
    'Adyar',
    'Thoraipakkam',
    'Medavakkam',
    'Madipakkam',
    'Nanganallur',
    'Mylapore',
    'Saidapet',
  ];

  const images = [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
  ];

  for (let i = 0; i < 20; i++) {
    const locality = locations[i];

    await prisma.flatmate.create({
      data: {
        userId,

        // Basic
        city: 'Chennai',
        propertyType: 'Flatmate',

        // Property
        apartmentType: 'Apartment',
        apartmentName: `Demo Flatmate ${i + 1} - ${locality}`,
        bhkType: i % 3 === 0 ? '2 BHK' : '3 BHK',
        floor: `${(i % 10) + 1}`,
        totalFloor: '12',
        roomType: i % 2 === 0 ? 'Private Room' : 'Shared Room',
        tenantType:
          i % 3 === 0
            ? 'Male'
            : i % 3 === 1
            ? 'Female'
            : 'Anyone',
        propertyAge: '1-3 Years',
        facing: 'East',
        builtUpArea: 900 + i * 50,

        // Location
        locality,
        street: `${locality} Main Road`,
        landmark: `Near ${locality} Bus Stand`,
        latitude: 12.90 + i * 0.01,
        longitude: 80.10 + i * 0.01,

        // Rent
        expectedRent: 7000 + i * 500,
        expectedDeposit: 15000 + i * 1000,
        maintenanceType: 'Included',
        maintenanceAmount: 0,
        availableFrom: new Date(),
        furnishing: 'Fully Furnished',
        parking: i % 2 === 0 ? 'Bike' : 'Bike & Car',

        description: `Looking for a clean and friendly flatmate in ${locality}, Chennai. Fully furnished apartment with WiFi, kitchen, washing machine and power backup.`,

        // Room
        attachedBathroom: true,
        bathroomType: 'Western',
        acRoom: i % 2 === 0,
        balcony: true,

        // Preferences
        nonVegAllowed: true,
        smokingAllowed: false,
        drinkingAllowed: false,

        // Amenities
        gym: true,
        gatedSecurity: true,
        liftSelected: true,
        swimmingPoolSelected: i % 2 === 0,
        clubHouseSelected: true,
        powerBackupSelected: true,
        parkSelected: true,

        // Contact
        whoShowsProperty: 'Owner',
        secondaryNumber: '8754020131',

        // Extras
        waterSupply: '24 Hours',
        directionsTip: `Opposite to ${locality} Railway Station`,

        // Availability
        availabilityDay: ['Monday', 'Tuesday', 'Wednesday'],
        startTime: '09:00 AM',
        endTime: '08:00 PM',
        availableAllDay: false,

        // Media
        images,
        video: '',

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Created Flatmate ${i + 1} - ${locality}`);
  }

  console.log('🎉 Successfully inserted 20 Flatmate listings.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });