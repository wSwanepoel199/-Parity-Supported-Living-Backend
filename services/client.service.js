const prisma = require('../lib/prisma');
const handlePrismaErrors = require('../utils/prismaErrorHandler');

class ClientService {
  static async create(data) {
    try {
      const { carers, ...client } = data;
      const parsedCarers = carers ? await prisma.user.findMany({
        where: {
          userId: { in: carers }
        },
        select: {
          userId: true
        }
      }) : [];
      try {
        const newClient = await prisma.client.create({
          data: {
            ...client,
            carers: {
              connect: parsedCarers
            }
          }
        });
        return newClient;
      }
      catch (err) {
        handlePrismaErrors(err);  // handles prisma specific erroes
      }
    }
    catch (err) {
      handlePrismaErrors(err);
    }
  }
  static async remove(data) {
    try {
      await prisma.client.delete({
        where: {
          clientId: data.params.id
        }
      });
      return;
    }
    catch (err) {
      handlePrismaErrors(err); //prisma error handler
    }
  }
  static async update(data) {
    console.log(data);
    // deletes listed keys from provided object
    for (let key of ["createdAt", "updatedAt", "posts"]) {
      delete data[key];
    }

    // checks if name is present and deletesit
    if (data.name) delete data.name;

    data.email = data.email.toLowerCase();  // converts provided email to lower case

    let updatedClient; //sets variable for later use
    const { carers, ...client } = data;
    try {
      updatedClient = await prisma.client.update({  // updates existing client with new information
        where: {
          clientId: client.clientId
        },
        data: client,
        include: {
          carers: true
        }
      });
    } catch (err) {
      if (!updatedClient) throw createError.NotFound("Could not find client to update"); //conditional that errors if no client is found
      handlePrismaErrors(err); //prisma error handler
    }
    if (carers) {
      // console.log(updatedUser);
      const updatedClientCarersId = updatedClient.carers.map(carers => carers.userId);
      const removedCarers = await updatedClientCarersId.filter(filterCarer => !carers.includes(filterCarer));
      const newCarers = await carers.filter(newCarer => !updatedClientCarersId.includes(newCarer));
      if (removedCarers) {
        try {
          await prisma.client.update({
            where: {
              clientId: client.clientId
            },
            data: {
              carers: {
                disconnect: removedCarers.map((id) => { return { userId: id }; })
              }
            }
          });
        }
        catch (err) {
          handlePrismaErrors(err); //prisma error handler
        }
      }
      if (newCarers) {
        try {
          await prisma.client.update({
            where: {
              clientId: client.clientId
            },
            data: {
              carers: {
                connect: newCarers.map((id) => { return { userId: id }; })
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
  static async get(data) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          userId: data.user
        }
      });

      const client = await prisma.client.findUnique({
        where: {
          clientId: data.params.id
        },
        include: {
          carers: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          posts: true
        }
      });

      if (user.role !== "Admin" && client.carers.some(carer => carer.userId === data.user)) {
        throw createError.Unauthorized("You may not access this Client's Details");
      }

      client.name = `${client?.firstName} ${client?.lastName}`;

      return client;

    }
    catch (err) {
      console.error(err);
      handlePrismaErrors(err);
    }
  }
  static async all(user) {
    let allClients;
    try {
      const loggedinUser = await prisma.user.findUnique({
        where: {
          userId: user
        }
      });
      if (loggedinUser.role !== 'Carer') {
        allClients = await prisma.client.findMany({
          include: {
            carers: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
      } else {
        allClients = await prisma.client.findMany({
          where: {
            carers: {
              some: {
                userId: loggedinUser.userId
              }
            }
          },
          include: {
            carers: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
      }
      if (allClients) {
        await allClients.forEach((client) => client.name = `${client.firstName} ${client?.lastName}`);
        return allClients;
      } else {
        return [];
      }

      // const allClients = await prisma.client.findMany({
      //   include: {
      //     carers: true
      //   }
      // }); //pulls all clients from db
      // return allClients;
    } catch (err) {
      handlePrismaErrors(err); //prisma error handler
    }
  }
}

module.exports = ClientService;