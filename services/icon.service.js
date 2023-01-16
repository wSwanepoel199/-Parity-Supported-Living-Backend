const prisma = require('../lib/prisma');
const createError = require('http-errors');

class IconService {
  static async genIcon(userid, userId) {
    const { identicon } = await import('@dicebear/collection');
    const { createAvatar } = await import('@dicebear/core');
    const avatar = await createAvatar(identicon, {
      seed: userId
    }).toDataUri();

    const icon = await prisma.icon.create({
      data: {
        userId: userid,
        icon: avatar
      }
    });

    return icon;
  }
  static async fetchIcon(userid) {
    let icon = await prisma.icon.findFirst({
      where: {
        userId: userid
      }
    });
    // if (!icon) throw createError.NotFound("No Icon");
    if (!icon) icon.icon = "No Icon";
    return icon;
  }
}

module.exports = IconService;