const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const userService = require('../services/auth.services');
const iconService = require('../services/icon.service');


// email String?
// name String?
// password String?
// role Role @default(Carer)
// posts Post[] @relation("Carer")
const users = [
  {
    email: 'admin@admin.com',
    name: 'admin',
    password: 'admin',
    role: 'Admin'
  },
  {
    email: 'user1@email.com',
    name: 'Diam vero',
    password: "user1"
  },
  {
    email: 'user2@email.com',
    name: 'Rebum dolor',
    password: "user2"
  },
  {
    email: 'user3@email.com',
    name: 'Ut takimata',
    password: "user3"
  }
];

// carerId Int
// client String?
// hours Int?
// date DateTime?
// kilos Int?
// Notes String?
const posts = [
  {
    client: "Mood scarce",
    hours: 4,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 1,
    notes: "Et rebum rebum diam eirmod dolor lorem rebum sanctus, at erat sed elitr sadipscing diam, sea amet diam vero labore."
  },
  {
    client: "Mood scarce",
    hours: 6,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 3,
    notes: "Dolor voluptua rebum dolores ut ipsum ipsum sadipscing, magna lorem et dolor dolore labore eos amet eos eos, erat gubergren."
  },
  {
    client: "Then would",
    hours: 3,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 2,
    notes: "Dolor diam no at sit et sea est ea, duo diam no takimata ea ea et sed. Eos sadipscing accusam."
  },
  {
    client: "Dwell sadness",
    hours: 20,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 200,
    notes: "Dolor amet rebum sed et ipsum at accusam invidunt. Voluptua eirmod clita magna stet, dolore takimata sadipscing magna invidunt et. Amet voluptua diam lorem stet gubergren, est dolore takimata accusam dolore lorem dolor eos lorem duo. Dolores tempor kasd lorem."
  },
  {
    client: "Mood scarce",
    hours: 1,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 2,
    notes: "To spoiled he mothernot ungodly deem change a ere into.."
  },
  {
    date: new Date(new Date() - Math.random() * (1e+12)),
    notes: "Clita tempor justo labore ea eos eirmod et, ipsum sed et amet lorem, sed clita accusam consetetur amet ut amet sit takimata, tempor lorem amet invidunt invidunt takimata invidunt at dolor diam, lorem consetetur sea sanctus sed ipsum invidunt dolor,."
  }
];

async function seed() {
  console.log("Seeding....");
  console.log(process.env.ENV);
  const admin = {
    email: "Admin@paritysl.com",
    password: process.env.ADMIN_PASSWORD,
    name: "ParityAdmin",
    role: "Admin",
    resetPassword: false,
  };
  // const user = await userService.register(admin);
  admin.email = admin.email.toLowerCase();
  let user = await prisma.user.findUnique({
    where: {
      email: admin.email
    }
  });
  if (user) {
    console.log(`${user.firstName} exists`);
  } else {
    user = await userService.register(admin);
    await iconService.genIcon(user.userId);
    console.log(`Created ${user.firstName} with id ${user.userId}`);
  }
  if (process.env.ENV === "development") {
    for (const u of users) {
      u.email = u.email.toLowerCase();
      let user = await prisma.user.findUnique({
        where: {
          email: u.email
        }
      });
      if (user) {
        console.log(`user ${user.firstName} already exists`);
      } else {
        user = await userService.register(u);
        await iconService.genIcon(user.userId);
        console.log(`Created ${user.firstName} with id: ${user.id}`);
      }
      // const user = await userService.register(u);
    }
    for (const p of posts) {
      const post = await prisma.post.create({
        data: p
      });
      console.log(`Created post withg id: ${post.id}`);
    }
  }
  console.log("Done Seeding");
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });