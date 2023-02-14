const client = require('../services/client.service');
const createError = require('http-errors');

class ClientController {
  static create = async (req, res, next) => {
    try {
      const client = await client.create(req.body);
      res.status(201).json({
        status: 201,
        data: {
          message: 'Client Successfully Created'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = ClientController;