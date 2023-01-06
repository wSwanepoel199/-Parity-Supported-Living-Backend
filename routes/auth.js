const express = require('express');
const userController = require('../controllers/auth.contoller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.user, Auth.admin, userController.all);

router.post('/register', Auth.user, Auth.admin, userController.register);

router.post('/login', userController.login);

router.put('/update', Auth.user, Auth.admin, userController.update);

router.get('/logout', userController.logout);

router.post('/delete', Auth.user, Auth.admin, userController.delete);


module.exports = router;