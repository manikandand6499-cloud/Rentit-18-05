import { PrismaClient, User, Property } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const chennaiAreas = [
  'Tambaram',
  'Velachery',
  'OMR',
  'T Nagar',
  'Porur',
  'Anna Nagar',
];

const tenants = ['Boys', 'Girls', 'Anyone'];

async function main() {
  // ✅ FIX TYPE
  const users: User[] = [];
  const properties: Property[] = [];

  // 🔥 1. USERS
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        mobile: faker.string.numeric(10), // ✅ FIXED
        email: faker.internet.email(),
        isProfileComplete: true,
        city: 'Chennai',
        locality: faker.helpers.arrayElement(chennaiAreas),

        latitude: faker.location.latitude(), // ✅ FIXED
        longitude: faker.location.longitude(), // ✅ FIXED
      },
    });

    users.push(user);
  }

  // 🔥 2. PROPERTIES
  for (let i = 0; i < 100; i++) {
    const owner = faker.helpers.arrayElement(users);
    const rent = faker.number.int({ min: 5000, max: 15000 });

    const property = await prisma.property.create({
      data: {
        userId: owner.id,

        city: 'Chennai',
        locality: faker.helpers.arrayElement(chennaiAreas),
        street: faker.location.streetAddress(),
        landmark: faker.company.name(),

        latitude: faker.location.latitude(), // ✅ FIXED
        longitude: faker.location.longitude(), // ✅ FIXED

        propertyName: faker.company.name() + ' PG',
        propertyType: 'PG/Hostel',

        roomType: [
          {
            rent,
            deposit: rent * 2,
            sharing: faker.helpers.arrayElement([
              'Single room',
              'Double sharing',
              '3 sharing',
            ]),
            amenities: ['AC', 'WiFi', 'Attached Bathroom'],
          },
        ],

        foodIncluded: true,
        foodType: { breakfast: true, lunch: true, dinner: true },

        pgAmenities: {
          wifi: true,
          laundry: true,
          powerBackup: true,
        },

        parking: faker.helpers.arrayElement(['Car', 'Bike', 'Both']),

        availableFrom: new Date(),
        noticePeriod: faker.number.int({ min: 7, max: 30 }),
        gateClosingTime: new Date(),

        images: [
          `https://picsum.photos/400/300?random=${i}`,
        ],

        contactName: faker.person.fullName(),
        mobileNo: faker.string.numeric(10), // ✅ FIXED

        whatsapp: true,
        whatsappupdates: true,

        preferredTenant: [faker.helpers.arrayElement(tenants)],
        preferredGuests: ['Students', 'Working Professionals'],

        restrictions: {
          smoking: faker.datatype.boolean(),
          drinking: faker.datatype.boolean(),
        },

        propertyDescription: faker.lorem.paragraph(),

        currentStep: 6,
        isDraft: false,
        isDeleted: false,
      },
    });

    properties.push(property);
  }

  // 🔥 3. LIKES
  for (let i = 0; i < 200; i++) {
    const user = faker.helpers.arrayElement(users);
    const property = faker.helpers.arrayElement(properties);

    try {
      await prisma.like.create({
        data: {
          userId: user.id,
          propertyId: property.id,
        },
      });
    } catch {}
  }

  // 🔥 4. PROPERTY VIEWS
  for (let i = 0; i < 200; i++) {
    const user = faker.helpers.arrayElement(users);
    const property = faker.helpers.arrayElement(properties);

    try {
      await prisma.propertyView.create({
        data: {
          userId: user.id,
          propertyId: property.id,
        },
      });
    } catch {}
  }

  console.log('🔥 SEED COMPLETED SUCCESSFULLY');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());