const file = require('../services/file.services');
const createError = require('http-errors');


class FileController {
  static upload = async (req, res, next) => {
    try {
      await file.upload(req.body);
      res.status(201).json({
        status: 201,
        message: "successfully uploaded any new users"
      });
    } catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = FileController;