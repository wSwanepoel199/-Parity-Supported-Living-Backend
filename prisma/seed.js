const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();


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
    carerId: 2,
    client: "Mood scarce",
    hours: 4,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 1,
    notes: "Et rebum rebum diam eirmod dolor lorem rebum sanctus, at erat sed elitr sadipscing diam, sea amet diam vero labore."
  },
  {
    carerId: 2,
    client: "Mood scarce",
    hours: 6,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 3,
    notes: "Dolor voluptua rebum dolores ut ipsum ipsum sadipscing, magna lorem et dolor dolore labore eos amet eos eos, erat gubergren."
  },
  {
    carerId: 3,
    client: "Then would",
    hours: 3,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 2,
    notes: "Dolor diam no at sit et sea est ea, duo diam no takimata ea ea et sed. Eos sadipscing accusam."
  },
  {
    carerId: 4,
    client: "Dwell sadness",
    hours: 20,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 200,
    notes: "Dolor amet rebum sed et ipsum at accusam invidunt. Voluptua eirmod clita magna stet, dolore takimata sadipscing magna invidunt et. Amet voluptua diam lorem stet gubergren, est dolore takimata accusam dolore lorem dolor eos lorem duo. Dolores tempor kasd lorem."
  },
  {
    carerId: 2,
    client: "Mood scarce",
    hours: 1,
    date: new Date(new Date() - Math.random() * (1e+12)),
    kilos: 2,
    notes: "To spoiled he mothernot ungodly deem change a ere into.."
  },
  {
    carerId: 1,
    date: new Date(new Date() - Math.random() * (1e+12)),
    notes: "Clita tempor justo labore ea eos eirmod et, ipsum sed et amet lorem, sed clita accusam consetetur amet ut amet sit takimata, tempor lorem amet invidunt invidunt takimata invidunt at dolor diam, lorem consetetur sea sanctus sed ipsum invidunt dolor,."
  }
];

async function seed() {
  console.log("Seeding....");
  console.log(process.env.ENV);
  const { genAvatar } = await import('../utils/avatarGenerator.mjs');
  if (process.env.ENV === "development") {
    for (const u of users) {
      u.password = bcrypt.hashSync(u.password, 8);
      const user = await prisma.user.create({
        data: u
      });
      const avatar = await genAvatar(user.userId);
      await prisma.user.update({
        where: {
          userId: user.userId
        },
        data: {
          icon: avatar
        }
      });
      console.log(`Created user with id: ${user.id}`);
    }
    for (const p of posts) {
      const post = await prisma.post.create({
        data: p
      });
      console.log(`Created post withg id: ${post.id}`);
    }
  }
  const admin = {
    email: "admin@paritysl.com",
    password: "admin",
    name: "ParityAdmin",
    role: "Admin"
  };
  admin.password = bcrypt.hashSync(admin.password, 8);
  const user = await prisma.user.create({
    data: admin
  });
  const avatar = await genAvatar(user.userId);
  await prisma.user.update({
    where: {
      userId: user.userId
    },
    data: {
      icon: avatar
    }
  });
  console.log(`Created ${user.name} with id ${user.userId}`);
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