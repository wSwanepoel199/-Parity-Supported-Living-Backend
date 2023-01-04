const express = require('express');
const RefreshTokenController = require('../controllers/refreshToken.controller');

const router = express.Router();

router.get('/', RefreshTokenController.refreshToken);

module.exports = router;