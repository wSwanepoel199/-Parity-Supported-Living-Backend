const createError = require("http-errors");

const whitelist = ["http://192.168.56.101:3000", "http://192.168.56.101:33937", "https://paritysl.herokuapp.com", "https://paritysl-dev.herokuapp.com", "http://192.168.1.2:3000", "http://localhost:3000", 'https://localhost:3000'];

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