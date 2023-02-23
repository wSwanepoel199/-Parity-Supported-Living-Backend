const prisma = require('../lib/prisma');
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class ClientService {
  static async create(data) {
    try {
      const { carers, ...client } = data;
      const parsedCarers = carers.map((id) => { return { userId: id }; });
      const newClient = await prisma.client.create({
        data: {
          ...client,
          carers: {
            connect: parsedCarers
          }
        }
      });
      return;
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