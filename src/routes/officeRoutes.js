const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const officeController = require('../controllers/officeController');

router.get('/services', authMiddleware, officeController.services);
router.get('/queue-services', authMiddleware, officeController.queueServices);
router.get('/queue-services/:slug', authMiddleware, officeController.queueServicesByslug);

module.exports = router;