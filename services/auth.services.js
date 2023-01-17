const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('../utils/jwt');
const exclude = require('../utils/exlude');
const RefreshTokenService = require('./refreshToken.services');
const handlePrismaErrors = require('../utils/prismaErrorHandler');


class AuthService {
  // register new user
  static async register(data) {
    data.password = bcrypt.hashSync(data.password, 8);
    delete data.showPassword;
    data.email = data.email.toLowerCase();
    try {
      const user = await prisma.user.create({
        data
      });
      return user;
    } catch (err) {
      handlePrismaErrors(err);
    }
    return;
  }
  // logs in existing user
  static async login(data) {
    const { email, password } = data;
    if (!email || !password) throw createError.BadRequest({ message: "Email or Password not provided", data: data });
    let user;
    let checkPassword;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase()
        }
      });
      checkPassword = bcrypt.compareSync(password, user.password);
      delete user.password;
      const refreshToken = await RefreshTokenService.create(user.id, email);
      user.accessToken = await jwt.signAccessToken(user.userId);
      return { user: user, token: refreshToken };
    } catch (err) {
      console.log(err);
      if (!user) throw createError.NotFound({ message: "No user exists with that email", data: data });
      if (!checkPassword) throw createError.Forbidden({ message: "Provided Email or Password is not correct", data: data });
      handlePrismaErrors(err);
    }
    return;
  }
  // updates existing user
  static async update(data) {
    for (let key of ["showPassword", "createdAt", "updatedAt"]) {
      delete data[key];
    }
    if (data.password) data.password = bcrypt.hashSync(data.password, 8);
    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: {
          userId: data.userId
        },
        data
      });
    } catch (err) {
      if (!updatedUser) throw createError.NotFound("Could not find user to update");
    }
    return;
  }
  // logs out existing user
  static async logout(data) {
    if (!data?.jwt) {
      await RefreshTokenService.clear();
      return;
    }
    await RefreshTokenService.remove(data.jwt);
    return;
  }
  static async delete(data) {
    const target = await prisma.user.delete({
      where: {
        userId: data.userId
      }
    });
    if (!target) throw createError.NotFound("That user does not exist");
    return target;
  }
  static async all() {
    const allUsers = await prisma.user.findMany();
    const users = allUsers.filter(item => item.name !== "ParityAdmin");
    await users.forEach((user) => exclude(user, ['password']));
    return users;
  }
}

module.exports = AuthService;