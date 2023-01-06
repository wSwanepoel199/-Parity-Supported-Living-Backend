const auth = require('../services/auth.services');
const createError = require('http-errors');

class AuthController {
  static register = async (req, res, next) => {
    try {
      await auth.register(req.body);
      res.status(201).json({
        status: 201,
        msg: "User Created"
      });
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
  static login = async (req, res, next) => {
    try {
      const data = await auth.login(req.body);
      res.cookie('jwt', data.token, {
        httpOnly: true,
        // SameSite: "None", 
        // secure: true, 
        // maxAge: (24 * 60 * 60 * 1000 * 200)
        maxAge: (1000 * 60 * 60 * 24)
      });
      res.status(200).json({
        msg: "Logged In Successfully",
        data: data.user
      });
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
  static update = async (req, res, next) => {
    try {
      await auth.update(req.body);
      res.status(200).json({
        status: 200,
        msg: 'user successfully updated'
      });
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
  static logout = async (req, res, next) => {
    try {
      await auth.logout(req.cookies);
      res.clearCookie('jwt', {
        httpOnly: true,
        // SameSite: "None", 
        // secure: true, 
      });
      res.sendStatus(204);
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
  static all = async (req, res, next) => {
    try {
      const users = await auth.all();
      res.status(200).json({
        status: 200,
        msg: "All Users Found",
        data: users
      });
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = AuthController;