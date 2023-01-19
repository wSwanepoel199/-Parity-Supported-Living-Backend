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
    let findPost;
    let updatePost;
    let userCheck;
    try {
      if (data.carerId !== '') {
        userCheck = await prisma.user.findUnique({
          where: {
            userId: data.carerId
          }
        });
      } else {
        userCheck = true;
        delete data.carerId;
      }

      console.log(data);
      findPost = await prisma.post.findUnique({
        where: {
          postId: data.postId
        }
      });
      updatePost = await prisma.post.update({
        where: {
          postId: data.postId
        },
        data
      });

      return updatePost;
    } catch (err) {
      handlePrismaErrors(err);
      if (!userCheck) throw createError.UnprocessableEntity("Invalid carer ID provided");
      if (!findPost) throw createError.NotFound("No Post with that id");
      if (!updatePost) throw createError.UnprocessableEntity("Could not update post");
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
      handlePrismaErrors(err);
    }
  }
}

module.exports = PostService;