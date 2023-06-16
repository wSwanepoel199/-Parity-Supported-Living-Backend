const PostService = require('../services/post.services');
const createError = require('http-errors');


class PostController {
  static create = async (req, res, next) => {
    try {
      await PostService.create(req.body);
      res.status(201).json({
        status: 201,
        data: {
          message: 'Post created successfully'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static update = async (req, res, next) => {
    try {
      await PostService.update(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'Successfully Updated Post'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static delete = async (req, res, next) => {
    try {
      await PostService.delete(req.body);
      res.status(200).json({
        status: 200,
        data: {
          message: 'Post deleted successfully'
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static get = async (req, res, next) => {
    try {
      const note = await PostService.get(req);
      res.status(200).json({
        status: 200,
        data: {
          message: "Note Found",
          data: note
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static all = async (req, res, next) => {
    try {
      const posts = await PostService.all(req.user);
      res.status(200).json({
        status: 200,
        data: {
          message: "All Posts Found",
          data: posts
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = PostController;