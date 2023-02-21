const prisma = require('../lib/prisma');
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class ClientService {
  static async create(data) {
    try {
      console.log(data);
      // const client = await prisma.client.create({
      //   data
      // });
      // return client;
    }
    catch (err) {
      handlePrismaErrors(err);
    }
  }
}

module.exports = ClientService;