const createError = require("http-errors");
const prisma = require("../lib/prisma");
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class PostService {
  static async create(data) {
    let newPost;
    try {
      newPost = await prisma.post.create({
        data
      });
      return newPost;
    } catch (err) {
      if (!newPost) {
        throw createError.BadRequest("Could not create post");
      }
      handlePrismaErrors(err);
    }
    return;
  }
  static async update(data) {
    for (let key of ["carer", "createdAt", "updatedAt"]) {
      delete data[key];
    }
    let updatedPost;
    try {
      updatedPost = await prisma.post.update({
        where: {
          postId: data.postId
        },
        data
      });
    } catch (err) {
      if (!updatedPost) throw createError.NotFound("No Post with that id");
      handlePrismaErrors(err);
    }
    return;
  }
  static async delete(data) {
    let post;
    try {
      post = await prisma.post.delete({
        where: {
          postId: data.postId
        }
      });
      return post;
    } catch (err) {
      if (!post) throw createError.NotFound("Post does not exist");
      handlePrismaErrors(err);
    }
    return;
  }
  static async all(user) {
    let allPosts;
    try {
      allPosts = await prisma.post.findMany({
        include: {
          carer: true
        }
      });
      return allPosts;
    } catch (err) {
      if (!allPosts) throw createError.NotFound("Could not find any posts");
      handlePrismaErrors(err);
    }
  }
}

module.exports = PostService;