// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Your existing user ID from User table
const userId = 2;

async function main() {
  console.log('🌱 Seeding 20 fake PG properties for userId = 2...');

  // ✅ Delete old demo PGs for this user
  await prisma.pGDetails.deleteMany({
    where: {
      userId,
      propertyName: {
        startsWith: 'Demo PG',
      },
    },
  });

  const chennaiLocations = [
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
    const locality = chennaiLocations[i];

    await prisma.pGDetails.create({
      data: {
        // ✅ Owner
        userId: userId,

        // ✅ Basic Info
        propertyType: 'PG',
        propertyName: `Demo PG ${i + 1} - ${locality}`,
        city: 'Chennai',
        locality: locality,
        street: `${locality} Main Road`,
        landmark: `Near ${locality} Bus Stand`,

        // ✅ Coordinates
        latitude: 12.90 + i * 0.01,
        longitude: 80.10 + i * 0.01,

        // ✅ Preferences
        preferredTenant:
          i % 3 === 0
            ? ['Boys']
            : i % 3 === 1
            ? ['Girls']
            : ['Boys', 'Girls'],

        preferredGuests: ['Students', 'Working Professionals'],

        // ✅ Room Types
        roomType: [
          {
            sharing: 'Single',
            rent: 12000 + i * 500,
            deposit: 15000,
            amenities: ['AC', 'Attached Bathroom', 'Cupboard'],
          },
          {
            sharing: 'Double',
            rent: 8000 + i * 300,
            deposit: 10000,
            amenities: ['WiFi', 'Bed', 'Fan'],
          },
          {
            sharing: 'Triple',
            rent: 6000 + i * 200,
            deposit: 8000,
            amenities: ['Bed', 'Fan'],
          },
        ],

        // ✅ Food
        foodIncluded: true,
        foodType: {
          breakfast: true,
          lunch: true,
          dinner: true,
        },

        // ✅ Parking
        parking: i % 2 === 0 ? 'Bike' : 'Bike & Car',

        // ✅ Amenities
        pgAmenities: {
          laundry: true,
          roomCleaning: true,
          wifi: true,
          commonTV: true,
          lift: true,
          powerBackup: true,
          refrigerator: true,
          mess: true,
        },

        // ✅ Restrictions
        restrictions: {
          smoking: false,
          drinking: false,
          loudMusic: false,
          nonVegAllowed: true,
          girlsEntry: i % 2 === 0,
        },

        // ✅ Availability
        availableFrom: new Date(),
        noticePeriod: 30,
        gateClosingTime: new Date('1970-01-01T22:30:00'),

        // ✅ Description
        propertyDescription: `Premium PG in ${locality}, Chennai. Fully furnished rooms with WiFi, food, laundry, power backup and room cleaning. Suitable for students and working professionals.`,

        // ✅ Contact
       contactName: 'Manikandan',
mobileNo: '8754020131',
whatsapp: true,
whatsappupdates: true,

        // ✅ Images
        images,

        // ✅ Final Status
        currentStep: 9,
        isDraft: false,
        isDeleted: false,
      },
    });

    console.log(`✅ Created Demo PG ${i + 1} - ${locality}`);
  }

  console.log('🎉 Successfully inserted 20 fake PG properties for userId = 2');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });