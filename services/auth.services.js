const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('../utils/jwt');
const exclude = require('../utils/exlude');
const RefreshTokenService = require('./refreshToken.services');
// const genAvatar = require('../utils/avatarGenerator.mjs');
;


class AuthService {
  // register new user
  static async register(data) {
    const { genAvatar } = await import('../utils/avatarGenerator.mjs');
    data.password = bcrypt.hashSync(data.password, 8);
    delete data.showPassword;
    const user = await prisma.user.create({
      data
    });
    // const avatar = await genAvatar(user.userId);
    // await prisma.user.update({
    //   where: {
    //     userId: user.userId
    //   },
    //   data: {
    //     icon: avatar
    //   }
    // });
    return user;
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
  // updates existing user
  static async update(data) {
    for (let key of ["showPassword", "createdAt", "updatedAt"]) {
      delete data[key];
    }
    if (data.password) data.password = bcrypt.hashSync(data.password, 8);
    const updatedUser = await prisma.user.update({
      where: {
        userId: data.userId
      },
      data
    });
    if (!updatedUser) throw createError.NotFound("No User with that id");
    return;
  }
  // logs out existing user
  static async logout(data) {
    if (!data?.jwt) return;
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