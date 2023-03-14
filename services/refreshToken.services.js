const prisma = require('../lib/prisma');
const createError = require('http-errors');
const jwt = require('../utils/jwt');
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class RefreshTokenService {
  static async create(userId, email) {
    const refreshToken = await jwt.signRefreshToken(email);
    const expireDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 200));
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
      throw createError.Forbidden({ message: "User credentials expired, please sign back in" });
    }
    let token;
    try {
      token = await prisma.RefreshToken.findFirst({
        where: {
          token: data.jwt
        },
        include: {
          user: true,
        }
      });
      if (!token) throw createError.Unauthorized("No credentials exist");
      token.user.accessToken = await jwt.verifyRefreshToken(data.jwt, token.user);
      token.user.expireTimer = 1000 * 60 * 30;
      token.user.name = `${token.user.firstName} ${token.user.lastName !== null ? token.user.lastName : ''}`; // generates a name value for front end compatibility
      return token.user;
    }
    catch (err) {
      if (!token) throw createError.Unauthorized("No credentials exist");
      handlePrismaErrors(err);
    }
    return;
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
  static async clear(refreshTokens, { all } = { all: false }) {
    for (const token of refreshTokens) {
      if (!token.expiresAt || all) {
        console.log('clearing token ', token.id);
        await prisma.RefreshToken.delete({
          where: {
            token: token.token
          }
        });
      } else if (Date.now() > Date.parse(token.expiresAt)) {
        console.log('clearing token ', token.id);
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