
const handlePrismaErrors = (err) => {
  switch (err.constructor.name) {
    case "PrismaClientKnownRequestError": {
      console.log(err.code);
      console.log(err.meta);
      console.log(err.message);
      throw createError.Conflict({ message: `${err.constructor.name}. '${err.meta.target}' must be unique` });
    }
    case "PrismaClientUnknownRequestError": {
      throw createError.BadRequest({ message: "Bad Request" });
    }
    case "PrismaClientRustPanicError": {

    }
    case "PrismaClientInitializationError": {

    }
    case "PrismaClientValidationError": {
      console.log(err.message);
      throw createError.NotAcceptable({ message: `${err.constructor.name}. Could not validate create request` });
    }
    default: {
      console.log(err);
      throw createError.BadRequest({ message: "Failed to create new User" });
    }
  }
};

module.exports = handlePrismaErrors;