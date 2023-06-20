const express = require('express');
const userController = require('../controllers/auth.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.user, Auth.admin, userController.all);

router.get('/get/:id', Auth.user, Auth.admin, userController.get);

router.post('/register', Auth.user, Auth.admin, userController.register);

router.post('/login', userController.login);

router.patch('/new', Auth.user, userController.newUserLogin);

router.put('/update', Auth.user, Auth.admin, userController.update);

router.post('/logout', userController.logout);

router.post('/delete', Auth.user, Auth.admin, userController.delete);


module.exports = router;