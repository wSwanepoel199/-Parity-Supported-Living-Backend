const express = require('express');
const clientController = require('../controllers/client.controller');
const Auth = require('../middleware/auth');

const router = express.Router();

router.get('/', Auth.user, clientController.all);

router.get('/get/:id', Auth.user, clientController.get);

router.post('/create', Auth.user, Auth.admin, clientController.create);

router.post('/remove', Auth.user, Auth.admin, clientController.remove);

router.put('/update', Auth.user, Auth.admin, clientController.update);

module.exports = router;