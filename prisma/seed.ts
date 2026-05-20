import { PrismaClient, User, PGDetails } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const cityData: Record<string, string[]> = {
  Chennai: ['Tambaram', 'Velachery', 'OMR', 'T Nagar', 'Porur', 'Anna Nagar'],
  Bangalore: ['Whitefield', 'BTM Layout', 'Electronic City', 'Marathahalli', 'Indiranagar', 'Koramangala'],
  Coimbatore: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Singanallur', 'Saibaba Colony'],
  Hyderabad: ['Madhapur', 'Gachibowli', 'Kondapur', 'Hitech City', 'Begumpet'],
};

const cities = Object.keys(cityData);
const tenants = ['Boys', 'Girls', 'Anyone'];

async function main() {
  const users: User[] = [];
  const properties: PGDetails[] = [];

  console.log('🚀 Seeding started...');

  // 🔥 1. USERS
  for (let i = 0; i < 20; i++) {
    const city = faker.helpers.arrayElement(cities);

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        mobile: faker.string.numeric(10),
        email: faker.internet.email(),
        isProfileComplete: true,

        city,
        locality: faker.helpers.arrayElement(cityData[city]),

        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    });

    users.push(user);
  }

  // 🔥 2. PROPERTIES (Balanced per city)
  const perCity = 25; // 25 x 4 = 100

  for (const city of cities) {
    for (let i = 0; i < perCity; i++) {
      const owner = faker.helpers.arrayElement(users);
      const rent = faker.number.int({ min: 5000, max: 18000 });

      const property = await prisma.pGDetails.create({
        data: {
          userId: owner.id,

          city,
          locality: faker.helpers.arrayElement(cityData[city]),
          street: faker.location.streetAddress(),
          landmark: faker.company.name(),

          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),

          propertyName: `${faker.person.lastName()} Residency`,
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
              amenities: ['AC', 'WiFi', 'Attached Bathroom', 'Cupboard'],
            },
          ],

          foodIncluded: faker.datatype.boolean(),

          foodType: {
            breakfast: true,
            lunch: faker.datatype.boolean(),
            dinner: true,
          },

          pgAmenities: {
            wifi: true,
            laundry: true,
            powerBackup: true,
            lift: faker.datatype.boolean(),
          },

          parking: faker.helpers.arrayElement(['Car', 'Bike', 'Both', 'None']),

          availableFrom: new Date(),
          noticePeriod: faker.number.int({ min: 7, max: 30 }),
          gateClosingTime: new Date(),

          images: [
            `https://picsum.photos/400/300?random=${city}-${i}`,
          ],

          contactName: faker.person.fullName(),
          mobileNo: faker.string.numeric(10),

          whatsapp: true,
          whatsappupdates: true,

          preferredTenant: [faker.helpers.arrayElement(tenants)],
          preferredGuests: [
            faker.helpers.arrayElement(['Students', 'Working Professionals']),
          ],

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
   
    } catch {}
  }

  console.log('🔥 SEED COMPLETED SUCCESSFULLY');
}

main()
  .catch((e) => {
    console.error('❌ ERROR:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });