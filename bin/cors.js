
const cors = {
  origin: [/192\.168\.1\.117/, /192\.168\.56\.101/],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

module.exports = cors;