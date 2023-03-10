const auth = require('../services/auth.services');
const icon = require('../services/icon.service');
const createError = require('http-errors');

class AuthController {
  static register = async (req, res, next) => {
    try {
      const user = await auth.register(req.body);
      await icon.genIcon(user.userId);
      res.status(201).json({
        status: 201,
        data: {
          message: "User Created Successfully"
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static login = async (req, res, next) => {
    try {
      const data = await auth.login(req.body);
      const avatar = await icon.fetchIcon(data.user.userId);
      if (process.env.NODE_ENV === "production") {
        res.cookie('jwt', data.token, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: (1000 * 60 * 60 * 24 * 200)
        });
      } else {
        res.cookie('jwt', data.token, {
          httpOnly: true,
          // sameSite: "None",
          // secure: true,
          // maxAge: (1000 * 60 * 60 * 24 * 200)
          maxAge: (1000 * 60 * 10)
        });
      }
      res.status(200).json({
        status: 200,
        data: {
          message: "Logged In Successfully",
          user: {
            ...data.user,
            icon: avatar || 'No Icon'
          }
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static newUserLogin = async (req, res, next) => {
    try {
      const user = await auth.passReset(req.body);
      const avatar = await icon.fetchIcon(user.userId);
      res.status(200).json({
        status: 200,
        data: {
          message: 'User successfully updated',
          user: {
            ...user,
            icon: avatar || 'No Icon'
          }
        }
      });
    }
    catch (err) {
      console.log(err);
      next(createError(err.statusCode, err.message));
    }
  };
  static update = async (req, res, next) => {
    try {
      await auth.update(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'User successfully updated'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static logout = async (req, res, next) => {
    try {
      await auth.logout(req.cookies, req.body);
      if (process.env.NODE_ENV === "production") {
        res.clearCookie('jwt', {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      } else {
        res.clearCookie('jwt', {
          httpOnly: true,
        });
      }
      res.status(204).json({
        status: 204,
        data: {
          message: 'Logged Out Successfully'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static delete = async (req, res, next) => {
    try {
      await auth.delete(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'User deleted successfully'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static all = async (req, res, next) => {
    try {
      const users = await auth.all();
      res.status(200).json({
        status: 200,
        data: {
          message: "All Users Found",
          data: users
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = AuthController;