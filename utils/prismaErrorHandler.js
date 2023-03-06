const createError = require("http-errors");


const handlePrismaErrors = (err) => {
  console.log(err);
  switch (err.constructor.name) {
    case "PrismaClientKnownRequestError": {
      console.log(err.constructor.name);
      console.log(err.code);
      console.log(err.meta);
      console.log(err.message);
      throw createError.Conflict({ type: err.constructor.name, code: err.code, meta: err.meta, message: err.message });
    }
    case "PrismaClientUnknownRequestError": {
      console.log(err.constructor.name);
      console.log(err);
      throw createError.BadRequest({ message: "Bad Request" });
    }
    case "PrismaClientRustPanicError": {
      console.log(err.constructor.name);
      console.log(err);

    }
    case "PrismaClientInitializationError": {
      console.log(err.constructor.name);
      console.log(err);

    }
    case "PrismaClientValidationError": {
      console.log(err.constructor.name);
      console.log(err);
      console.log(err.message);
      throw createError.NotAcceptable({ type: err.constructor.name, err: err, message: `${err.constructor.name}. Could not validate request` });
    }
    default: {
      console.log(err);
      // throw createError.BadRequest({ message: "Failed to process request, try again or contact support" });
    }
  }
};

module.exports = handlePrismaErrors;