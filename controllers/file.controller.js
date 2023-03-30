const file = require('../services/file.services');
const createError = require('http-errors');


class FileController {
  static upload = async (req, res, next) => {
    try {
      switch (req.query.type) {
        case "client": {
          await file.uploadClient(req.body);
          break;
        }
        case "user": {
          await file.uploadUser(req.body);
          break;
        }
        case "post": {
          await file.uploadPost(req.body);
          break;
        }
        default: {
          console.log("error");
          throw createError.UnprocessableEntity("Could not process uploaded file");
        }
      }
      // await file.upload(req.body, req.query);
      console.log("upload");
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