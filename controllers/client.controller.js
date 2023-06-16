const ClientService = require('../services/client.service');
const createError = require('http-errors');

// TODO: Create Clients in Database
// TODO: Link Clients to users
// TODO: Attach Clients to notes
// TODO: Allow clients/users to return with an attached list is clients/users

class ClientController {
  static create = async (req, res, next) => {
    try {
      await ClientService.create(req.body);
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
  static update = async (req, res, next) => {
    try {
      await ClientService.update(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'Client successfully updated'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static remove = async (req, res, next) => {
    try {
      await ClientService.remove(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'Client Successfully Deleted'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static get = async (req, res, next) => {
    try {
      const client = await ClientService.get(req);
      res.status(200).json({
        status: 200,
        data: {
          message: "Successfully Found Client",
          data: client
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static all = async (req, res, next) => {
    try {
      const clients = await ClientService.all(req.user);
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