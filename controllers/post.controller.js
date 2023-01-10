const post = require('../services/post.services');
const createError = require('http-errors');


class PostController {
  static create = async (req, res, next) => {
    try {
      await post.create(req.body);
      res.status(201).json({
        status: 201,
        data: {
          message: 'Post created successfully'
        }
      });
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
  static update = async (req, res, next) => {
    try {
      await post.update(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'Successfully Updated Post'
        }
      });
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
  static delete = async (req, res, next) => {
    try {
      await post.delete(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'Post deleted successfully'
        }
      });
    }
    catch (err) {
      res.status(err.statusCode).json(createError(err.statusCode, err.message));
      next(createError(err.statusCode, err.message));
    }
  };
  static all = async (req, res, next) => {
    try {
      const posts = await post.all(req.user);
      res.status(200).json({
        status: 200,
        data: {
          message: "All Posts Found",
          data: posts
        }
      });
    }
    catch (err) {
      res.status(err.statusCode).json({ status: err.statusCode, msg: err.message });
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = PostController;