const file = require('../services/file.services');
const createError = require('http-errors');


class FileController {
  static upload = async (req, res, next) => {
    try {
      // console.log(req);
      await file.upload(req.body, req.query);
      res.status(201).json({
        status: 201,
        message: `Successfully added new ${req.query.type} entries`,
        type: req.query.type
      });
    } catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = FileController;