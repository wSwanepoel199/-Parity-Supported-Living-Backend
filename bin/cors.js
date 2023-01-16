const createError = require("http-errors");

const whitelist = ["http://192.168.56.101:3000", "http://192.168.56.101:33937", "https://paritysl.herokuapp.com", "https://paritysl-pip-dev-tutusnje8ftni.herokuapp.com"];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(createError.Unauthorized("Blocked By Cors"));
    }
  },
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;