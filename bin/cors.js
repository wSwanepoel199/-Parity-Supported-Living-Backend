const createError = require("http-errors");

const whitelist = [/192\.168\./, 'https://paritysl-frontend.onrender.com/'];

const cors = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, ture);
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