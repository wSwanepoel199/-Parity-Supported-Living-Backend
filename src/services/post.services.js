const createError = require("http-errors");
const prisma = require("@lib/prisma");
const handlePrismaErrors = require('@utils/prismaErrorHandler');

class PostService {
  static async create(data) {
    if (data.carerId) {
      try {
        const carer = await prisma.user.findUnique({
          where: {
            userId: data.carerId
          }
        });
        data.carerName = `${carer.firstName} ${carer?.lastName}`;
        console.log(data.carerName, " attempted to create a note");
      }
      catch (err) {
        handlePrismaErrors(err);
        console.log(err);
      }
    }
    if (data.clientId) {
      try {
        const client = await prisma.client.findUnique({
          where: {
            clientId: data.clientId
          }
        });

        data.clientName = `${client.firstName} ${client?.lastName}`;
      }
      catch (err) {
        handlePrismaErrors(err);
        console.log(err);
      }
    }
    try {
      const newPost = await prisma.post.create({
        data
      });

      console.log(data.carerName, "Successfully created note");
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
          postId: data.params.id
        }
      });
      return post;
    } catch (err) {
      if (!post) throw createError.NotFound("Post does not exist");
      handlePrismaErrors(err);
    }
    return;
  }
  static async get(data) {
    let post;
    // console.log(data);
    console.log(data.params.id);
    console.log(data.user);
    try {
      const user = await prisma.user.findUnique({
        where: {
          userId: data.user
        }
      });

      const post = await prisma.post.findUnique({
        where: {
          postId: data.params.id
        },
        include: {
          carer: true,
          client: true
        }
      });

      if (user.role !== "Admin" && data.user !== post.carerId) {
        console.log(user);
        console.log(post);
        throw createError.Unauthorized("You may not access this note");
      }
      return post;

    }
    catch (err) {
      console.error(err);
      handlePrismaErrors(err);
    }
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
            carer: {
              select: {
                firstName: true,
                lastName: true,
                userId: true,
              }
            },
            client: {
              select: {
                firstName: true,
                lastName: true,
                clientId: true,
              }
            }
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
            carer: {
              select: {
                firstName: true,
                lastName: true,
                userId: true,
              }
            },
            client: {
              select: {
                firstName: true,
                lastName: true,
                clientId: true,
              }
            }
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