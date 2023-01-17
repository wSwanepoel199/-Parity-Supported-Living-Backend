const prisma = require('../lib/prisma');
const createError = require('http-errors');
const handlePrismaErrors = require('../utils/prismaErrorHandler');
const userService = require('./auth.services');
const iconService = require('./icon.service');




class FileService {
  static async upload(file) {
    try {
      for (const user of file) {
        if (!user) {
          continue;
        }
        const checkUser = await prisma.user.findUnique({
          where: {
            email: user.email
          }
        });
        if (checkUser) {
          console.log(`${user.firstName} already exists`);
        } else {
          const newUser = await userService.register(user);
          await iconService.genIcon(newUser.userId);
          console.log(`Created ${newUser.firstName} with id ${newUser.userId}`);
        }
      }
      return;
    } catch (err) {
      handlePrismaErrors(err);
    }
  }
}

module.exports = FileService;