const express = require('express');
const userController = require('../controllers/user.controller');
const Auth = require('@middleware/auth');

const router = express.Router();

router.get('/', Auth.checkIfAuthed, Auth.checkIfAdmin, userController.all);

router.get('/get/:id', Auth.checkIfAuthed, Auth.checkIfAdmin, userController.get);

router.post('/register', Auth.checkIfAuthed, Auth.checkIfAdmin, userController.register);

router.post('/login', userController.login);

router.patch('/new', Auth.checkIfAuthed, userController.newUserLogin);

router.put('/update', Auth.checkIfAuthed, Auth.checkIfAdmin, userController.update);

router.post('/logout', userController.logout);

router.get('/delete/:id', Auth.checkIfAuthed, Auth.checkIfAdmin, userController.delete);


module.exports = router;