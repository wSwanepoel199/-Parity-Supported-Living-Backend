const express = require('express');
const fileController = require('../controllers/file.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.post('/upload', Auth.checkIfAuthed, Auth.checkIfAdmin, fileController.upload);

module.exports = router;