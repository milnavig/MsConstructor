const Router = require('express');

const router = new Router();

const microserviceController = require('./../controllers/microserviceController');

router.post('/create', microserviceController.create);
router.get('/read', microserviceController.read);

module.exports = router;