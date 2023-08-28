const express = require('express');
const postController = require('../controllers/post.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.checkIfAuthed, postController.all);
router.get('/get/:id', Auth.checkIfAuthed, postController.get);
router.post('/create', Auth.checkIfAuthed, postController.create);
router.put('/update', Auth.checkIfAuthed, Auth.checkIfAdmin, postController.update);
router.get('/delete/:id', Auth.checkIfAuthed, Auth.checkIfAdmin, postController.delete);

module.exports = router;