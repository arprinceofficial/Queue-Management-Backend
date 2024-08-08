const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const userOfficeController = require('../controllers/userOfficeController');
const imageController = require('../controllers/imageController');

router.post('/login', userOfficeController.login);
router.get('/current-user', authMiddleware, userOfficeController.currentUser);
router.get('/logout', authMiddleware, userOfficeController.logout);
router.post('/:imagepath/upload', authMiddleware, imageController.singleImageUpload, userOfficeController.uploadUserImage);
router.put('/otp-request', userOfficeController.otpRequestEmail);
router.put('/otp-verify', userOfficeController.verifyOtp);

module.exports = router;