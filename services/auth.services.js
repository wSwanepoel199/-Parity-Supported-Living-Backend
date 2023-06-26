const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('../utils/jwt');
const exclude = require('../utils/exlude');
const RefreshTokenService = require('./refreshToken.services');
const IconService = require('./icon.service');
const handlePrismaErrors = require('../utils/prismaErrorHandler');


class AuthService {
  // register new user
  static async register(data) {

    const { clients, ...user } = data;
    // const parsedClients = clients?.map((id) => { return { clientId: id }; });
    console.log(clients);
    const parsedClients = clients ? await prisma.client.findMany({
      where: {
        clientId: { in: clients }
      },
      select: {
        clientId: true
      }
    }) : [];

    if (user.name) {  // checks if name is present
      user.name = data.name.split(' '); // splits name into array
      user.firstName = data.name[0]; // assigns string at index 0 to first name
      user.lastName = data.name[1]; // assigns string at index 1 to last name
      delete user.name; //deletes the name value
    }

    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 8);   // encrypts recieved password
    } else {
      user.password = bcrypt.hashSync(`${user.firstName}1234`, 8);
    }

    user.email = user.email.toLowerCase(); // converts provided email to lower case cause case insensitivity does not appear to be working
    try {
      const newUser = await prisma.user.create({    // creates new user
        data: {
          ...user,
          clients: {
            connect: parsedClients
          }
        }
      });

      return newUser;   // returns new user object
    } catch (err) {
      handlePrismaErrors(err);  // handles prisma specific erroes
    }
    return;
  }
  // logs in existing user
  static async login(data) {
    const { email, password } = data; //extracs email and password from passed data
    if (!email || !password) throw createError.BadRequest({ message: "Email or Password not provided", data: data }); //checks if either is missing and errors
    // sets user and checkPassword here to be used later
    let user;
    let checkPassword;
    try {
      user = await prisma.user.findUnique({    // locates user with provided email
        where: {
          email: email.toLowerCase()
        }
      });

      checkPassword = bcrypt.compareSync(password, user.password); //compares found user's hashed password with provided
      if (!checkPassword) throw createError.Forbidden({ message: "Provided Email or Password is not correct", data: data }); //considitonal error that triggers if passwordCheck fails
      delete user.password; //deletes password from user object

      user.name = `${user.firstName} ${user.lastName !== null ? user.lastName : ''}`; // generates a name value for front end compatibility

      const refreshToken = await RefreshTokenService.create(user.userId, email.toLowerCase()); // generates a refreshtoken to be used for authentication
      user.accessToken = await jwt.signAccessToken(user.userId); //generates accessToken using jwt to be used for authentication
      user.expireTimer = 1000 * 60 * 30;
      return { user: user, token: refreshToken }; //returns user and refreshtoken
    } catch (err) {
      console.log(err); //logs error for troubleshooting
      if (!user) throw createError.NotFound({ message: "No user exists with that email", data: data }); //conditional error that triggers if no user is found
      if (!checkPassword) throw createError.Forbidden({ message: "Provided Email or Password is not correct", data: data }); //considitonal error that triggers if passwordCheck fails
      handlePrismaErrors(err); //function that handles prisma errors
    }
    return;
  }
  // updates existing user
  static async update(data) {
    // deletes listed keys from provided object
    for (let key of ["showPassword", "createdAt", "updatedAt"]) {
      delete data[key];
    }
    if (data.resetPassword) { //checks if password is provided
      data.password = bcrypt.hashSync(`${data.firstName}1234`, 8); // encrypts it to replace existing password
    }

    // checks if name is present, splits it into array and assigns index 0 and 1 to firstName and lastName, then deletes name
    if (data.name) {
      data.name = data.name.split(' ');
      data.firstName = data.name[0];
      data.lastName = data.name[1];
      delete data.name;
    }

    data.email = data.email.toLowerCase();  // converts provided email to lower case

    let updatedUser; //sets variable for later use
    const { clients, posts, ...user } = data;
    console.log(user);
    try {
      const refreshTokens = await prisma.refreshToken.findMany({
        where: {
          userId: user.userId
        }
      });
      if (refreshTokens) {
        console.log(refreshTokens);
        await RefreshTokenService.clear(refreshTokens, { all: true });
      }
    }
    catch (err) {
      handlePrismaErrors(err); //prisma error handler
    }
    try {
      updatedUser = await prisma.user.update({  // updates existing user with new information
        where: {
          userId: user.userId
        },
        data: {
          ...user
        },
        include: {
          clients: true
        }
      });
    } catch (err) {
      if (!updatedUser) throw createError.NotFound("Could not find user to update"); //conditional that errors if no user is found
      handlePrismaErrors(err); //prisma error handler
    }
    if (clients) {
      // console.log(updatedUser);
      const updatedUserClientsId = updatedUser.clients.map(client => client.clientId);
      const removedClients = await updatedUserClientsId.filter(filterClient => !clients.includes(filterClient));
      const newClients = await clients.filter(newClient => !updatedUserClientsId.includes(newClient));
      if (removedClients) {
        try {
          await prisma.user.update({
            where: {
              userId: user.userId
            },
            data: {
              clients: {
                disconnect: removedClients.map((id) => { return { clientId: id }; })
              }
            }
          });
        }
        catch (err) {
          handlePrismaErrors(err); //prisma error handler
        }
      }
      if (newClients) {
        try {
          await prisma.user.update({
            where: {
              userId: user.userId
            },
            data: {
              clients: {
                connect: newClients.map((id) => { return { clientId: id }; })
              }
            }
          });
        }
        catch (err) {
          handlePrismaErrors(err); //prisma error handler
        }
      }
    }
    return;
  }
  // route specific for normal users to set new password
  static async passReset(data) {
    // cariables to be used later
    let user;
    let checkPassword;
    try {
      user = await prisma.user.findUnique({ //locates user with provided userId
        where: {
          userId: data.userId
        }
      });
      checkPassword = !bcrypt.compareSync(data.password, user.password); //compares found user's hashed password with provided
      if (!checkPassword) throw createError.Conflict("New password must be different form current password"); //if passwords match, throw error
      const password = bcrypt.hashSync(data.password, 8);
      user = await prisma.user.update({ //updates user details with new password and sets resetPassword to false
        where: {
          userId: user.userId
        },
        data: {
          resetPassword: false,
          password: password
        }
      });
      return user;
    } catch (err) {
      console.log(err);
      if (!user) throw createError.NotFound("Could not update password as user does not exist"); //if user can not be found, throws error
      if (!checkPassword) throw createError.Conflict("New password must be different from current password"); //if passwords match, throw error
      handlePrismaErrors(err); //prisma error handler
    }
    return;
  }

  // logs out existing user
  static async logout(token, { userId }) {
    // checks if refresh token has expired on front then clears db of expired tokens
    if (!token?.jwt) {
      const refreshTokens = await prisma.refreshToken.findMany({
        where: {
          userId: userId
        }
      });
      if (refreshTokens) {
        await RefreshTokenService.clear(refreshTokens);
      }
      return;
    }
    await RefreshTokenService.remove(token.jwt);  // removed non expired token from db
    return;
  }
  // delete existing user
  static async delete(data) {
    let user; //creates user variable for later use
    try {
      user = await prisma.user.findUnique({   // finds user to delete and deletes
        where: {
          userId: data.params.id
        }
      });
      if (user) {
        await IconService.deleteIcon(user.userId); //deletes icon data from db

        const userTokens = await prisma.refreshToken.findMany({   //finds all refreshTokens with users userId
          where: {
            userId: user.userId
          }
        });
        if (userTokens) {
          for (const token of userTokens) {
            console.log('clearing token ', token.id);
            await prisma.RefreshToken.delete({
              where: {
                token: token.token
              }
            });
          }
          //await RefreshTokenService.clear(userTokens); //if atleast 1 is found, it is cleared from db
        }

        await prisma.user.delete({ // deletes user
          where: {
            userId: user.userId
          }
        });
      }
      return;
    } catch (err) {
      if (!user) throw createError.NotFound("That user does not exist"); //conditional that errors if no user is found
      handlePrismaErrors(err); //prisma error handler
    }
    return;
  }
  static async get(data) {
    try {
      const admin = await prisma.user.findUnique({
        where: {
          userId: data.user
        }
      });

      const user = await prisma.user.findUnique({
        where: {
          userId: data.params.id
        },
        include: {
          posts: true,
          clients: true
        }
      });
      if (admin.role !== "Admin") {
        throw createError.Unauthorized("You may not access this User");
      }
      user.name = `${user?.firstName} ${user?.lastName}`;
      return user;

    }
    catch (err) {
      console.error(err);
      handlePrismaErrors(err);
    }
  }
  static async all() {
    let allUsers; //variable for later use
    try {
      allUsers = await prisma.user.findMany({
        include: {
          clients: true
        }
      }); //pulls all users from db
      const users = allUsers.filter(item => item.id !== 1); //filters out man admin to prevent locking out of app
      // runs forEach on found users to remove passwords and add in name for front end compatibility
      await users.forEach((user) => {
        user.name = `${user.firstName} ${user.lastName !== null ? user.lastName : ''}`;
        exclude(user, ['password']);
        user.clients.forEach((client) => client.name = `${client.firstName} ${client?.lastName}`);
      });
      return users;
    } catch (err) {
      handlePrismaErrors(err); //prisma error handler
    }
  }
}

module.exports = AuthService;