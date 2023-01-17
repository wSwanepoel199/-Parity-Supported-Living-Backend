const prisma = require('../lib/prisma');
const createError = require('http-errors');
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class IconService {
  static async genIcon(userid, userId) {
    const { identicon } = await import('@dicebear/collection');
    const { createAvatar } = await import('@dicebear/core');
    const avatar = await createAvatar(identicon, {
      seed: userId
    }).toDataUri();
    try {
      const icon = await prisma.icon.create({
        data: {
          userId: userid,
          icon: avatar
        }
      });
      return icon;
    } catch (err) {
      handlePrismaErrors(err);
    }
    return;
  }
  static async fetchIcon(userid) {
    let icon;
    try {
      icon = await prisma.icon.findFirst({
        where: {
          userId: userid
        }
      });
      return icon;
    } catch (err) {
      handlePrismaErrors(err);
    }
    // if (!icon) throw createError.NotFound("No Icon");
  }
}

module.exports = IconService;