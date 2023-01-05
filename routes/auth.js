const express = require('express');
const userController = require('../controllers/auth.contoller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.user, Auth.admin, userController.all);

router.post('/register', Auth.user, Auth.admin, userController.register);

router.post('/login', userController.login);

router.get('/logout', userController.logout);


module.exports = router;