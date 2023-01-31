const jwt = require('../utils/jwt');
const createError = require('http-errors');
const prisma = require('../lib/prisma');
const refreshToken = require('../services/refreshToken.services');
const RefreshTokenController = require('../controllers/refreshToken.controller');

class Auth {
  static user = async (req, res, next) => {
    if (!req.headers.authorization) return next(createError.Unauthorized('Not Authorised'));
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(createError.Unauthorized({ message: 'Token has not been provided', trigger: 'auth' }));
    }
    await jwt.verifyAccessToken(token).then(user => {
      req.user = user.payload;
      next();
    }).catch(err => {
      console.log(err.message);
      next(createError.Unauthorized({ message: err.message, trigger: 'auth' }));
    });
  };
  static admin = async (req, res, next) => {
    const foundUser = await prisma.user.findFirst({
      where: {
        userId: req.user
      }
    });
    if (!foundUser || !["Admin", "Coordinator"].includes(foundUser.role)) {
      // res.status(403).json(createError.Forbidden(403, err.message));
      next(createError.Forbidden({ message: "Forbidden from accessing this Route" }));
    }
    next();
  };
}

module.exports = Auth;