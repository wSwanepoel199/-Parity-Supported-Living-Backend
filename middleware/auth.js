const jwt = require('../utils/jwt');
const createError = require('http-errors');
const prisma = require('../lib/prisma');

class Auth {
  static user = async (req, res, next) => {
    if (!req.headers.authorization) return next(createError.Unauthorized('Not Authorised'));
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(createError.Unauthorized('Token has not been provided'));
    }
    await jwt.verifyAccessToken(token).then(user => {
      req.user = user.payload;
      next();
    }).catch(err => {
      res.status(err.statusCode).json(createError.Unauthorized(err.message));
      next(createError.Unauthorized(err.message));
    });
  };
  static admin = async (req, res, next) => {
    const foundUser = await prisma.user.findFirst({
      where: {
        userId: req.user
      }
    });
    if (!foundUser || foundUser.role !== "Admin") return next(createError.Forbidden({ message: "Forbidden from accessing this Route" }));
    next();
  };
}

module.exports = Auth;