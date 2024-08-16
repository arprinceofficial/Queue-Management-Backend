const router = require('express').Router();
const { authAdminMiddleware } = require('../middleware/authMiddleware');
const userAdminController = require('../controllers/userAdminController');
const imageController = require('../controllers/imageController');

router.post('/login', userAdminController.login);
router.get('/current-user', authAdminMiddleware, userAdminController.currentUser);
router.get('/logout', authAdminMiddleware, userAdminController.logout);
router.post('/:imagepath/upload', authAdminMiddleware, imageController.singleImageUpload, userAdminController.uploadUserImage);
router.put('/otp-request', userAdminController.otpRequestEmail);
router.put('/otp-verify', userAdminController.verifyOtp);

module.exports = router;