const createError = require("http-errors");


const handlePrismaErrors = (err) => {
  switch (err.constructor.name) {
    case "PrismaClientKnownRequestError": {
      console.log(err.code);
      console.log(err.meta);
      console.log(err.message);
      throw createError.Conflict({ message: `'${err.meta.target}' must be unique` });
    }
    case "PrismaClientUnknownRequestError": {
      console.log(err);
      throw createError.BadRequest({ message: "Bad Request" });
    }
    case "PrismaClientRustPanicError": {
      console.log(err);

    }
    case "PrismaClientInitializationError": {
      console.log(err);

    }
    case "PrismaClientValidationError": {
      console.log(err);
      console.log(err.message);
      throw createError.NotAcceptable({ message: `${err.constructor.name}. Could not validate request` });
    }
    default: {
      console.log(err);
      // throw createError.BadRequest({ message: "Failed to process request, try again or contact support" });
    }
  }
};

module.exports = handlePrismaErrors;