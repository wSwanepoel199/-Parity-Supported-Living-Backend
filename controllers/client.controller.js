const client = require('../services/client.service');
const createError = require('http-errors');

// TODO: Create Clients in Database
// TODO: Link Clients to users
// TODO: Attach Clients to notes
// TODO: Allow clients/users to return with an attached list is clients/users

class ClientController {
  static create = async (req, res, next) => {
    try {
      await client.create(req.body);
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
  static edit;
  static remove;
  static all = async (req, res, next) => {
    try {
      const clients = await client.all(req.user);
      res.status(200).json({
        status: 200,
        data: {
          message: "All Users Found",
          data: clients
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = ClientController;