const express = require('express');
const postController = require('../controllers/post.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.user, postController.all);
router.get('/get/:id', Auth.user, postController.get);
router.post('/create', Auth.user, postController.create);
router.put('/update', Auth.user, Auth.admin, postController.update);
router.get('/delete/:id', Auth.user, Auth.admin, postController.delete);

module.exports = router;