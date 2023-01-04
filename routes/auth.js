const express = require('express');
const userController = require('../controllers/auth.contoller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, userController.all);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/logout', userController.logout);


module.exports = router;