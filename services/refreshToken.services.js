const prisma = require('../lib/prisma');
const createError = require('http-errors');
const jwt = require('../utils/jwt');

class RefreshTokenService {
  static async create(userId, email) {
    const refreshToken = await jwt.signRefreshToken(email);
    const expireDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 200));
    console.log(expireDate);
    const token = await prisma.RefreshToken.create({
      data: {
        userId: userId,
        token: refreshToken,
        expiresAt: expireDate,
      }
    });
    return token.token;
  }
  static async refresh(data) {
    if (!data?.jwt) {
      const refreshTokens = await prisma.RefreshToken.findMany();
      if (refreshTokens) {
        this.clear(refreshTokens);
      }
      throw createError.Forbidden("User credentials expired, please sign back in");
    }
    const token = await prisma.RefreshToken.findFirst({
      where: {
        token: data.jwt
      },
      include: {
        user: true,
      }
    });
    if (!token) throw createError.Unauthorized("No credentials exist");
    token.user.accessToken = await jwt.verifyRefreshToken(data.jwt, token.user);
    token.user.name = `${token.user.firstName} ${token.user.lastName !== null ? token.user.lastName : ''}`; // generates a name value for front end compatibility
    return token.user;
  }
  static async remove(refreshToken) {
    const checkToken = await prisma.RefreshToken.findFirst({
      where: {
        token: refreshToken
      }
    });
    if (checkToken) {
      await prisma.RefreshToken.delete({
        where: {
          token: refreshToken
        }
      });
    }
    return;
  }
  static async clear(refreshTokens) {
    for (const token of refreshTokens) {
      if (!token.expiresAt) {
        await prisma.RefreshToken.delete({
          where: {
            token: token.token
          }
        });
      } else if (Date.now() > Date.parse(token.expiresAt)) {
        await prisma.RefreshToken.delete({
          where: {
            token: token.token
          }
        });
      }
    }
    return;
  }
}

module.exports = RefreshTokenService;