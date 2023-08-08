const createError = require("http-errors");

const whitelist = process.env.FRONT_END.split(", ");

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // console.log(origin);
      callback(null, true);
    } else {
      callback(createError.Unauthorized("Blocked By Cors"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', "Content-Length", 'Authorization'],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;