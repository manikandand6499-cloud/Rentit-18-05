// prisma/seed-apartment.ts
//
// Run:
// npx ts-node prisma/seed-apartment.ts
//
// Inserts 20 realistic Apartment listings in Chennai for userId = 2

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const userId = 2;

async function main() {
  console.log('🌱 Seeding 20 realistic Chennai apartments...');

  // Delete old demo apartments
  await prisma.apartment.deleteMany({
    where: {
      userId,
      apartmentType: 'Demo Apartment',
    },
  });

  const locations = [
    {
      locality: 'Pallavaram',
      landmark: 'Near Pallavaram Bus Stand',
      street: 'GST Road',
      lat: 12.9675,
      lng: 80.1491,
    },
    {
      locality: 'Chrompet',
      landmark: 'Near MIT Gate',
      street: 'Radha Nagar Main Road',
      lat: 12.9516,
      lng: 80.1462,
    },
    {
      locality: 'Tambaram',
      landmark: 'Near Railway Station',
      street: 'Mudichur Road',
      lat: 12.9249,
      lng: 80.1000,
    },
    {
      locality: 'Velachery',
      landmark: 'Near Phoenix Mall',
      street: '100 Feet Road',
      lat: 12.9815,
      lng: 80.2180,
    },
    {
      locality: 'Koyambedu',
      landmark: 'Near CMBT',
      street: 'Jawaharlal Nehru Road',
      lat: 13.0692,
      lng: 80.1946,
    },
    {
      locality: 'Guindy',
      landmark: 'Near Olympia Tech Park',
      street: 'Mount Road',
      lat: 13.0105,
      lng: 80.2209,
    },
    {
      locality: 'Porur',
      landmark: 'Near Porur Junction',
      street: 'Arcot Road',
      lat: 13.0381,
      lng: 80.1565,
    },
    {
      locality: 'Sholinganallur',
      landmark: 'Near Infosys',
      street: 'OMR',
      lat: 12.8996,
      lng: 80.2279,
    },
    {
      locality: 'Perungudi',
      landmark: 'Near World Trade Center',
      street: 'OMR',
      lat: 12.9617,
      lng: 80.2411,
    },
    {
      locality: 'Anna Nagar',
      landmark: 'Near Tower Park',
      street: '2nd Avenue',
      lat: 13.0850,
      lng: 80.2101,
    },
    {
      locality: 'Adyar',
      landmark: 'Near Depot',
      street: 'LB Road',
      lat: 13.0067,
      lng: 80.2574,
    },
    {
      locality: 'T Nagar',
      landmark: 'Near Pondy Bazaar',
      street: 'Usman Road',
      lat: 13.0418,
      lng: 80.2337,
    },
    {
      locality: 'Vadapalani',
      landmark: 'Near Forum Mall',
      street: 'Arcot Road',
      lat: 13.0503,
      lng: 80.2123,
    },
    {
      locality: 'Medavakkam',
      landmark: 'Near Junction',
      street: 'Velachery Main Road',
      lat: 12.9170,
      lng: 80.1920,
    },
    {
      locality: 'Madipakkam',
      landmark: 'Near Ram Nagar',
      street: 'Medavakkam Main Road',
      lat: 12.9636,
      lng: 80.1987,
    },
    {
      locality: 'Nanganallur',
      landmark: 'Near Anjaneyar Temple',
      street: '4th Main Road',
      lat: 12.9784,
      lng: 80.1880,
    },
    {
      locality: 'Mylapore',
      landmark: 'Near Kapaleeshwarar Temple',
      street: 'RK Mutt Road',
      lat: 13.0338,
      lng: 80.2697,
    },
    {
      locality: 'Saidapet',
      landmark: 'Near Court',
      street: 'Anna Salai',
      lat: 13.0237,
      lng: 80.2237,
    },
    {
      locality: 'Thoraipakkam',
      landmark: 'Near Signal',
      street: 'OMR',
      lat: 12.9401,
      lng: 80.2362,
    },
    {
      locality: 'Alandur',
      landmark: 'Near Metro Station',
      street: 'MKN Road',
      lat: 13.0049,
      lng: 80.2014,
    },
  ];

  const imageSets = [
    [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    ],
    [
      'https://images.unsplash.com/photo-1494526585095-c41746248156',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    ],
    [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118',
    ],
    [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80',
    ],
  ];

  const apartmentNames = [
    'Sai Residency',
    'Lakshmi Heights',
    'Green Valley',
    'Skyline Residency',
    'Royal Enclave',
    'Elite Homes',
    'Harmony Apartments',
    'Sunshine Residency',
    'Blue Bell Towers',
    'Pearl Gardens',
    'Palm Grove',
    'Golden Nest',
    'Urban Heights',
    'Crystal Homes',
    'Silver Springs',
    'Lake View Residency',
    'Happy Homes',
    'Hill Crest',
    'Ocean Breeze',
    'Prestige Residency',
  ];

  for (let i = 0; i < 20; i++) {
    const loc = locations[i];
    const images = imageSets[i % imageSets.length];

    await prisma.apartment.create({
      data: {
        userId,

        // Location
        city: 'Chennai',
        locality: loc.locality,
        street: loc.street,
        landmark: loc.landmark,
        latitude: loc.lat,
        longitude: loc.lng,

        // Property
        propertyType2: 'Apartment',
        apartmentType: apartmentNames[i],
        buildingType: 'Residential Apartment',
        bhkType: i % 3 === 0 ? '2 BHK' : i % 3 === 1 ? '3 BHK' : '1 BHK',
        floor: (i % 12) + 1,
        totalFloor: 15,
        builtUpArea: 650 + i * 75,
        propertyAge: i % 2 === 0 ? '1-5 Years' : '5-10 Years',
        facing: ['East', 'West', 'North', 'South'][i % 4],

        // Rent
        rentType: 'Rent',
        expectedRent: 18000 + i * 2500,
        deposit: 100000 + i * 5000,
        maintenanceAmount: 2000 + i * 100,
        maintenance: 'Monthly',
        rentNegotiable: i % 2 === 0,
        availableFrom: new Date().toISOString(),
        preferredTenant:
          i % 3 === 0
            ? ['Family']
            : i % 3 === 1
            ? ['Bachelors']
            : ['Family', 'Bachelors'],

        // Features
        otherFeatures: {
          vastuCompliant: true,
          internetReady: true,
          modularKitchen: true,
        },

        furnishing:
          i % 3 === 0
            ? 'Fully Furnished'
            : i % 3 === 1
            ? 'Semi Furnished'
            : 'Unfurnished',

        parking: i % 2 === 0 ? 'Car & Bike' : 'Bike Only',

        description: `${apartmentNames[i]} in ${loc.locality}, Chennai. Spacious and well-ventilated apartment with premium amenities, gated security, lift, power backup, and excellent connectivity.`,

        // Additional Details
        bathroom: i % 3 === 0 ? 2 : 3,
        noOfBalcony: i % 2 === 0 ? 2 : 1,
        waterSupply: '24 Hours',
        petAllowed: i % 2 === 0,
        gymAllowed: true,
        nonVegAllowed: true,
        gateSecurity: true,
        shownBy: 'Owner',
        propertyCondition: 'Excellent',
        secondaryNumber: '8754020131',
        unitsPropertiesAvailable: i % 2 === 0,
        directions: `Opposite to ${loc.landmark}`,

        amenities: [
          'Lift',
          'Power Backup',
          'Covered Parking',
          'Gym',
          'Swimming Pool',
          'Security',
          'Children Play Area',
          'Club House',
        ],

        // Media
        images,
        video: '',

        // Availability
        availabilityDay: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Saturday',
        ],
        startTime: '09:00 AM',
        endTime: '07:00 PM',
        availableAllDay: false,
      },
    });

    console.log(`✅ Created Apartment ${i + 1} - ${loc.locality}`);
  }

  console.log('🎉 Successfully inserted 20 realistic apartments.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });