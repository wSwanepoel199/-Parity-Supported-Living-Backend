const prisma = require('../lib/prisma');
const createError = require('http-errors');

class IconService {
  static async genIcon(userid, userId) {
    const { identicon } = await import('@dicebear/collection');
    const { createAvatar } = await import('@dicebear/core');
    const avatar = await createAvatar(identicon, {
      seed: userId
    });

    const icon = await prisma.icon.create({
      data: {
        userId: userid,
        icon: avatar
      }
    });

    return icon;
  }
  static async fetchIcon(userid) {
    const icon = await prisma.icon.findFirst({
      where: {
        userId: userid
      }
    });
    if (!icon) throw createError.NotFound("No Icon");
    return icon;
  }
}

module.exports = IconService;