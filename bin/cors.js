
const cors = {
  origin: [/192\.168\./, 'https://paritysl-frontend.onrender.com/'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

module.exports = cors;