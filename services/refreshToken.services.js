const prisma = require('../lib/prisma');
const createError = require('http-errors');
const jwt = require('../utils/jwt');

class RefreshTokenService {
  static async create(userid, email) {
    const tokenCheck = await prisma.RefreshToken.findUnique({
      where: {
        userId: userid
      }
    });
    if (tokenCheck) {
      await prisma.RefreshToken.delete({
        where: {
          userId: userid
        }
      });
    }
    const refreshToken = await jwt.signRefreshToken(email);
    const token = await prisma.RefreshToken.create({
      data: {
        userId: userid,
        token: refreshToken
      }
    });
    return token.token;
  }
  static async refresh(data) {
    if (!data?.jwt) throw createError.Unauthorized("No refresh token provided");
    const token = await prisma.RefreshToken.findUnique({
      where: {
        token: data.jwt
      },
      include: {
        user: true,
        user: {
          include: {
            icon: true
          }
        }
      }
    });
    if (!token) throw createError.Unauthorized("No user with that provided token");
    token.user.accessToken = await jwt.verifyRefreshToken(data.jwt, token.user);
    return token.user;
  }
  static async remove(refreshToken) {
    const checkToken = await prisma.RefreshToken.findUnique({
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
}

module.exports = RefreshTokenService;