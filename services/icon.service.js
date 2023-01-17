const prisma = require('../lib/prisma');
const createError = require('http-errors');
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class IconService {
  static async genIcon(userId) {
    const { identicon } = await import('@dicebear/collection');
    const { createAvatar } = await import('@dicebear/core');
    const avatar = await createAvatar(identicon, {
      seed: userId
    }).toDataUri();
    try {
      const icon = await prisma.icon.create({
        data: {
          userId: userId,
          icon: avatar
        }
      });
      return icon;
    } catch (err) {
      handlePrismaErrors(err);
    }
    return;
  }
  static async fetchIcon(userId) {
    let icon;
    try {
      icon = await prisma.icon.findFirst({
        where: {
          userId: userId
        }
      });
      return icon;
    } catch (err) {
      handlePrismaErrors(err);
    }
    // if (!icon) throw createError.NotFound("No Icon");
  }
  static async deleteIcon(userId) {
    let icon;
    try {
      icon = await prisma.icon.findUnique({
        where: {
          userId: userId
        }
      });
      if (icon) {
        await prisma.icon.delete({
          where: {
            userId: icon.userId
          }
        });
      }
      return;
    } catch (err) {
      handlePrismaErrors(err);
    }
  }
}

module.exports = IconService;