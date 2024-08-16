const router = require('express').Router();
const { authOfficeMiddleware } = require('../middleware/authMiddleware');
const officeController = require('../controllers/officeController');

router.post('/services', authOfficeMiddleware, officeController.services);
router.post('/queue-services', authOfficeMiddleware, officeController.queueServices);
router.post('/queue-services/:slug', authOfficeMiddleware, officeController.queueServicesByslug);
router.post('/queue-services-create', authOfficeMiddleware, officeController.createQueueToken);
router.post('/queue-token/waiting-screen', authOfficeMiddleware, officeController.getWaitingScreen);

module.exports = router;