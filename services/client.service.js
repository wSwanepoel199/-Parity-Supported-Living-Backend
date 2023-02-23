const prisma = require('../lib/prisma');
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class ClientService {
  static async create(data) {
    try {
      console.log(data);
      const { carers, ...client } = data;
      const parsedCarers = carers.map((id) => { return { userId: id }; });
      console.log(parsedCarers);
      const newClient = await prisma.client.create({
        data: {
          ...client,
          carers: {
            connect: parsedCarers
          }
        }
      });
      console.log(newClient);
      // const client = await prisma.client.create({
      //   data
      // });
      // return client;
    }
    catch (err) {
      handlePrismaErrors(err);
    }
  }
  static async all(user) {
    let allClients;
    try {
      const loggedinUser = await prisma.user.findUnique({
        where: {
          userId: user
        }
      });
      if (loggedinUser.role !== 'Carer') {
        allClients = await prisma.client.findMany({
          include: {
            carers: true
          }
        });
      } else {
        allClients = await prisma.client.findMany({
          where: {
            carers: {
              some: {
                userId: loggedinUser.userId
              }
            }
          },
          include: {
            carers: true
          }
        });
      }
      if (allClients) {
        return allClients;
      } else {
        return [];
      }

      // const allClients = await prisma.client.findMany({
      //   include: {
      //     carers: true
      //   }
      // }); //pulls all clients from db
      // return allClients;
    } catch (err) {
      handlePrismaErrors(err); //prisma error handler
    }
  }
}

module.exports = ClientService;