const createError = require("http-errors");
const prisma = require("../lib/prisma");
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class PostService {
  static async create(data) {
    try {
      const newPost = await prisma.post.create({
        data
      });
      return newPost;
    } catch (err) {
      // if (!newPost) {
      //   throw createError.BadRequest("Could not create post");
      // }
      handlePrismaErrors(err);
      console.log(err);
    }
    return;
  }
  static async update(data) {
    for (let key of ["carer", "createdAt", "updatedAt", "client"]) {
      delete data[key];
    }
    let updatePost;
    let userCheck;
    let clientCheck;
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
    }
    catch (err) {
      if (!userCheck) throw createError.UnprocessableEntity("Invalid carer ID provided");
      handlePrismaErrors(err);
    }
    try {
      if (data.clientId !== '') {
        clientCheck = await prisma.client.findUnique({
          where: {
            clientId: data.clientId
          }
        });
      } else {
        clientCheck = true;
        delete data.clientId;
      }
    }
    catch (err) {
      if (!clientCheck) throw createError.UnprocessableEntity("Invalid client ID provided");
      handlePrismaErrors(err);
    }
    try {
      updatePost = await prisma.post.update({
        where: {
          postId: data.postId
        },
        data
      });

      return updatePost;
    } catch (err) {
      if (!updatePost) throw createError.UnprocessableEntity("Could not update post");
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
      const loggedinUser = await prisma.user.findUnique({
        where: {
          userId: user
        }
      });
      if (loggedinUser.role !== 'Carer') {
        allPosts = await prisma.post.findMany({
          orderBy: {
            date: 'desc'
          },
          include: {
            carer: true,
            client: true
          }
        });
      } else {
        allPosts = await prisma.post.findMany({
          where: {
            carerId: loggedinUser.userId,
            NOT: {
              clientId: null
            }
          },
          orderBy: {
            date: 'desc'
          },
          include: {
            carer: true,
            client: true
          }
        });
      }
      if (allPosts) {
        return allPosts;
      } else {
        return [];
      }
    } catch (err) {
      handlePrismaErrors(err);
    }
  }
}

module.exports = PostService;