const prisma = require('../lib/prisma');
const createError = require('http-errors');
const handlePrismaErrors = require('../utils/prismaErrorHandler');
const userService = require('./auth.services');
const iconService = require('./icon.service');
const postService = require('./post.services');
const clientService = require('./client.service');




class FileService {
  // static async upload(file, { type }) {
  //   console.log(file);
  //   return;
  //   switch (type) {
  //     case "user": {
  //       for (const user of file) {
  //         if (!user) {
  //           continue;
  //         }
  //         const parsedUser = Object.fromEntries(
  //           Object.entries(user).map(([k, v]) => {
  //             switch (k) {
  //               case "userId":
  //               case 'firstName':
  //               case 'lastName': {
  //                 return [k, v];
  //               }
  //               case "clients": {
  //                 return [k, v.split(', ')];
  //               }
  //               default: {
  //                 return [k.toLowerCase(), v];
  //               }
  //             }
  //           })
  //         );
  //         try {
  //           const checkUser = await prisma.user.findUnique({
  //             where: {
  //               email: parsedUser?.email
  //             }
  //           });
  //           console.log(`${checkUser.firstName} already exists`);
  //           continue;
  //         } catch (err) {
  //           try {
  //             var newUser = await userService.register(parsedUser);
  //             await iconService.genIcon(newUser.userId);
  //             console.log(`Created ${newUser.firstName} with id ${newUser.userId}`);
  //             continue;
  //           }
  //           catch (err) {
  //             console.log("error: ", err.message);
  //             handlePrismaErrors(err);
  //             console.log("Could not create new notes entry");
  //             throw createError.UnprocessableEntity(`Failed to create ${parsedUser.firstName}`);
  //           }
  //         }
  //       }
  //       return;
  //     }
  //     case "client": {
  //       for (const client of file) {
  //         if (!client) {
  //           continue;
  //         }
  //         const parsedClient = Object.fromEntries(
  //           Object.entries(client).map(([k, v]) => {
  //             switch (k) {
  //               case 'clientId':
  //               case 'firstName':
  //               case 'lastName': {
  //                 return [k, v];
  //               }
  //               case 'Number': {
  //                 return ['phoneNumber', v];
  //               }
  //               case "carers": {
  //                 return [k, v.split(', ')];
  //               }
  //               default: {
  //                 return [k.toLowerCase(), v];
  //               }
  //             }
  //           })
  //         );
  //         try {
  //           const checkClient = await prisma.client.findUnique({
  //             where: {
  //               clientId: parsedClient?.clientId
  //             }
  //           });
  //           console.log(`${checkClient.firstName} already exists`);
  //           continue;
  //         } catch (err) {
  //           try {
  //             var newClient = await clientService.create(parsedClient);
  //             console.log(`Created ${newClient.firstName} with id ${newClient.clientId}`);
  //             continue;
  //           }
  //           catch (err) {
  //             console.log("error: ", err.message);
  //             handlePrismaErrors(err);
  //             console.log("Could not create new notes entry");
  //             throw createError.UnprocessableEntity(`Failed to create user ${parsedClient.firstName}`);
  //           }
  //         }
  //       }
  //       return;
  //     }
  //     case "post": {
  //       for (const post of file) {
  //         if (!post) {
  //           continue;
  //         }
  //         const parsedPost = Object.fromEntries(
  //           Object.entries(post).map(([k, v]) => {
  //             switch (k) {
  //               case "Distance(KM)": {
  //                 return [k = "kilos", v];
  //               }
  //               case "carerId":
  //               case "carerName":
  //               case "clientId":
  //               case "clientName": {
  //                 return [k, v];
  //               }
  //               case "private": {
  //                 return v === "true" ? [k, true] : [k, false];
  //               }
  //               case "carer": {
  //                 delete parsedPost.carer;
  //               }
  //               case "client": {
  //                 delete parsedPost.client;
  //               }
  //               case "date": {
  //                 return [k, v = new Date(parsedPost.date).toISOString()];
  //               }
  //               default: {
  //                 return [k.toLowerCase(), v];
  //               }
  //             }
  //           })
  //         );
  //         if (parsedPost.carerId) {
  //           try {
  //             const carerCheck = await prisma.user.findUnique({
  //               where: {
  //                 userId: parsedPost.carerId
  //               }
  //             });
  //             if (!carerCheck) delete parsedPost.carerId;
  //           }
  //           catch (err) {
  //             handlePrismaErrors(err);
  //             delete parsedPost.carerId;
  //           }
  //         }
  //         if (parsedPost.clientId) {
  //           try {
  //             console.log("clientCheck");
  //             const clientCheck = await prisma.client.findUnique({
  //               where: {
  //                 clientId: parsedPost.clientId
  //               }
  //             });
  //             if (!clientCheck) delete parsedPost.clientId;
  //           }
  //           catch (err) {
  //             console.log("clientCheckFail");
  //             handlePrismaErrors(err);
  //             delete parsedPost.clientId;
  //           }
  //         }
  //         try {
  //           parsedPost.private = parsedPost.private === "true" ? true : false;
  //           await postService.create(parsedPost);
  //         }
  //         catch (err) {
  //           console.error(err);
  //           if (typeof parsedPost.private === "string") throw createError.UnprocessableEntity("private failed to convert from string");
  //           handlePrismaErrors(err);
  //           console.log("Could not create new notes entry");
  //           break;
  //         }
  //       }
  //       return;
  //     }
  //     default: {
  //       throw createError.UnprocessableEntity("Could not process uploaded file");
  //     }
  //   }
  // }
  static async uploadClient(file) {
    for (const client of file) {
      if (!client) {
        continue;
      }
      const parsedClient = Object.fromEntries(
        Object.entries(client).map(([k, v]) => {
          switch (k) {
            case 'clientId':
            case 'firstName':
            case 'lastName': {
              return [k, v];
            }
            case 'Number': {
              return ['phoneNumber', v];
            }
            case "carers": {
              return [k, v.split(', ')];
            }
            default: {
              return [k.toLowerCase(), v];
            }
          }
        })
      );
      try {
        const checkClient = await prisma.client.findUnique({
          where: {
            clientId: parsedClient?.clientId
          }
        });
        console.log(`${checkClient.firstName} already exists`);
        continue;
      } catch (err) {
        try {
          var newClient = await clientService.create(parsedClient);
          console.log(`Created ${newClient.firstName} with id ${newClient.clientId}`);
          continue;
        }
        catch (err) {
          console.log("error: ", err.message);
          handlePrismaErrors(err);
          console.log("Could not create new notes entry");
          throw createError.UnprocessableEntity(`Failed to create user ${parsedClient.firstName}`);
        }
      }
    }
    return;
  }
  static async uploadUser(file) {
    for (const user of file) {
      if (!user) {
        continue;
      }
      const parsedUser = Object.fromEntries(
        Object.entries(user).map(([k, v]) => {
          switch (k) {
            case "userId":
            case 'firstName':
            case 'lastName': {
              return [k, v];
            }
            case "clients": {
              return [k, v.split(', ')];
            }
            default: {
              return [k.toLowerCase(), v];
            }
          }
        })
      );
      try {
        const checkUser = await prisma.user.findUnique({
          where: {
            email: parsedUser?.email
          }
        });
        console.log(`${checkUser.firstName} already exists`);
        continue;
      } catch (err) {
        try {
          var newUser = await userService.register(parsedUser);
          await iconService.genIcon(newUser.userId);
          console.log(`Created ${newUser.firstName} with id ${newUser.userId}`);
          continue;
        }
        catch (err) {
          console.log("error: ", err.message);
          handlePrismaErrors(err);
          console.log("Could not create new notes entry");
          throw createError.UnprocessableEntity(`Failed to create ${parsedUser.firstName}`);
        }
      }
    }
    return;
  }
  static async uploadPost(post) {
    for (const post of file) {
      if (!post) {
        continue;
      }
      const parsedPost = Object.fromEntries(
        Object.entries(post).map(([k, v]) => {
          switch (k) {
            case "Distance(KM)": {
              return [k = "kilos", v];
            }
            case "carerId":
            case "carerName":
            case "clientId":
            case "clientName": {
              return [k, v];
            }
            case "private": {
              return v === "true" ? [k, true] : [k, false];
            }
            case "carer": {
              delete parsedPost.carer;
            }
            case "client": {
              delete parsedPost.client;
            }
            case "date": {
              return [k, v = new Date(parsedPost.date).toISOString()];
            }
            default: {
              return [k.toLowerCase(), v];
            }
          }
        })
      );
      if (parsedPost.carerId) {
        try {
          const carerCheck = await prisma.user.findUnique({
            where: {
              userId: parsedPost.carerId
            }
          });
          if (!carerCheck) delete parsedPost.carerId;
        }
        catch (err) {
          handlePrismaErrors(err);
          delete parsedPost.carerId;
        }
      }
      if (parsedPost.clientId) {
        try {
          console.log("clientCheck");
          const clientCheck = await prisma.client.findUnique({
            where: {
              clientId: parsedPost.clientId
            }
          });
          if (!clientCheck) delete parsedPost.clientId;
        }
        catch (err) {
          console.log("clientCheckFail");
          handlePrismaErrors(err);
          delete parsedPost.clientId;
        }
      }
      try {
        parsedPost.private = parsedPost.private === "true" ? true : false;
        await postService.create(parsedPost);
      }
      catch (err) {
        console.error(err);
        if (typeof parsedPost.private === "string") throw createError.UnprocessableEntity("private failed to convert from string");
        handlePrismaErrors(err);
        console.log("Could not create new notes entry");
        break;
      }
    }
    return;
  }
}

module.exports = FileService;