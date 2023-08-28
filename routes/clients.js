const express = require('express');
const clientController = require('../controllers/client.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.checkIfAuthed, clientController.all);

router.get('/get/:id', Auth.checkIfAuthed, clientController.get);

router.post('/create', Auth.checkIfAuthed, Auth.checkIfAdmin, clientController.create);

router.get('/delete/:id', Auth.checkIfAuthed, Auth.checkIfAdmin, clientController.remove);

router.put('/update', Auth.checkIfAuthed, Auth.checkIfAdmin, clientController.update);

module.exports = router;