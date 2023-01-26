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
            Object.entries(user).map(([k, v]) => {
              if (k === "userId" || k === 'firstName' || k === 'lastName') {
                return [k, v];
              } else {
                return [k.toLowerCase(), v];
              }
            })
          );
          console.log(parsedUser);
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

          if (!newUser) {
            console.log("Could not create new notes entry");
            continue;
          }
        }
      } else if (type === "post") {
        for (const post of file) {
          if (!post) {
            continue;
          }
          // TODO: if userId doesn't exist, delete id
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
          delete parsedPost.carer;
          parsedPost.date = new Date(parsedPost.date).toISOString();
          var newPost = await postService.create(parsedPost);
          if (!newPost) {
            console.log("Could not create new notes entry");
            continue;
          }
        }
      } else {
        throw createError.UnprocessableEntity("Could not process uploaded file");
      }
      return;
    } catch (err) {
      console.log('err:', err);
      if (!['user', 'post'].includes(type)) throw createError.UnprocessableEntity("Could not process uploaded file");
      handlePrismaErrors(err);
      throw createError.UnprocessableEntity("Failed to create new entires from uploaded file");
    }
  }
}

module.exports = FileService;