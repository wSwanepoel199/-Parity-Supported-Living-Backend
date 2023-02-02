const jwt = require('jsonwebtoken');
const createError = require("http-errors");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// { expiresIn: '1 days' }
const signAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ payload }, accessTokenSecret, { expiresIn: '30 minutes' }, (err, token) => {
      if (err) reject(createError.InternalServerError());
      resolve(token);
    });
  });
};
// { expiresIn: '200 days' }
const signRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ payload }, refreshTokenSecret, { expiresIn: '200 days' }, (err, token) => {
      if (err) reject(createError.InternalServerError());
      resolve(token);
    });
  });
};

const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, accessTokenSecret, (err, payload) => {
      if (err) {
        const message = err.name === 'JsonWebTokenError' ? "Unautherised" : err.message;
        return reject(createError.Unauthorized(message));
      }
      resolve(payload);
    });
  });
};

const verifyRefreshToken = (token, user) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, refreshTokenSecret, (err, payload) => {
      if (err || user.email !== payload.payload) {
        const message = err.name === 'JsonWebTokenError' ? "Unautherised" : err.message;
        return reject(createError.Unauthorized(message));
      }
      resolve(signAccessToken(user.userId));
    });
  });
};

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };