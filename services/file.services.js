const prisma = require('../lib/prisma');
const createError = require('http-errors');
const handlePrismaErrors = require('../utils/prismaErrorHandler');
const userService = require('./auth.services');
const iconService = require('./icon.service');
const postService = require('./post.services');




class FileService {
  static async upload(file, { type }) {
    try {
      if (type === "user") {
        for (const user of file) {
          if (!user) {
            continue;
          }
          const parsedUser = Object.fromEntries(
            Object.entries(user).map(([k, v]) => [k.toLowerCase(), v])
          );
          const checkUser = await prisma.user.findUnique({
            where: {
              email: parsedUser.email
            }
          });
          if (checkUser) {
            console.log(`${checkUser.firstName} already exists`);
          } else {
            var newUser = await userService.register(parsedUser);
            await iconService.genIcon(newUser.userId);
            console.log(`Created ${newUser.firstName} with id ${newUser.userId}`);
          }
        }
      } else if (type === "post") {
        for (const post of file) {
          if (!post) {
            continue;
          }
          const parsedPost = Object.fromEntries(
            Object.entries(post).map(([k, v]) => {
              if (k === "Distance(KM)") {
                return [k = 'kilos', v];
              } else if (k === "carerId") {
                return [k, v];
              } else {
                return [k.toLowerCase(), v];
              }
            })
          );
          parsedPost.date = new Date(parsedPost.date).toISOString();
          await postService.create(parsedPost);
        }
      } else {
        throw createError.UnprocessableEntity("Could not process uploaded file");
      }
      return;
    } catch (err) {
      if (!['user', 'post'].includes(type)) throw createError.UnprocessableEntity("Could not process uploaded file");
      // if (!newUser || !newPost) throw createError.UnprocessableEntity("Failed to create new entires from uploaded file");
      handlePrismaErrors(err);
      throw createError.UnprocessableEntity("Failed to create new entires from uploaded file");
    }
  }
}

module.exports = FileService;