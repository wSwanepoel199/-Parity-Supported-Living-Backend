const createError = require("http-errors");

const whitelist = ["http://192.168.56.101:3000", 'https://paritysl-frontend.onrender.com'];

const cors = {
  origin: (origin, callback) => {
    console.log(origin);
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

module.exports = cors;