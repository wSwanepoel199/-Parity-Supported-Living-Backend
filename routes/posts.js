const express = require('express');
const postController = require('../controllers/post.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.user, postController.all);
router.post('/create', Auth.user, postController.create);
router.put('/update', Auth.user, postController.update);

module.exports = router;