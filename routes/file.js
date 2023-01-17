const express = require('express');
const fileController = require('../controllers/file.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.post('/upload', Auth.user, Auth.admin, fileController.upload);

module.exports = router;