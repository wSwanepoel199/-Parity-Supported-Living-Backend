const express = require('express');
const clientController = require('../controllers/client.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.user, clientController.all);

router.post('/create', Auth.user, Auth.admin, clientController.create);


module.exports = router;