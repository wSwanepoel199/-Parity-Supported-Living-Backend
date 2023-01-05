const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('../utils/jwt');
const RefreshTokenService = require('./refreshToken.services');

class AuthService {
  // register new user
  static async register(data) {
    data.password = bcrypt.hashSync(data.password, 8);
    delete data.showPassword;
    const user = await prisma.user.create({
      data
    });
    return;
  }
  // logs in existing user
  static async login(data) {
    const { email, password } = data;
    if (!email || !password) throw createError.BadRequest({ message: "Email or Password not provided", data: data });
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) throw createError.NotFound({ message: "No user exists with that email", data: data });
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) throw createError.Unauthorized({ message: "Provided Email or Password is not correct", data: data });
    delete user.password;
    const refreshToken = await RefreshTokenService.create(user.id, email);
    user.accessToken = await jwt.signAccessToken(user.userId);
    return { user: user, token: refreshToken };
  }
  // logs out existing user
  static async logout(data) {
    if (!data?.jwt) return;
    await RefreshTokenService.remove(data.jwt);
    return;
  }
  static async all() {
    const allUsers = await prisma.user.findMany();
    return allUsers;
  }
}

module.exports = AuthService;