const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const officeController = require('../controllers/officeController');

router.post('/services', authMiddleware, officeController.services);
router.post('/queue-services', authMiddleware, officeController.queueServices);
router.post('/queue-services/:slug', authMiddleware, officeController.queueServicesByslug);
router.post('/queue-services-create', authMiddleware, officeController.createQueueToken);
router.post('/queue-token/waiting-screen', authMiddleware, officeController.getWaitingScreen);

module.exports = router;