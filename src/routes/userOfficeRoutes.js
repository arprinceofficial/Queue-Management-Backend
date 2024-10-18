const router = require('express').Router();
const { authOfficeMiddleware } = require('../middleware/authMiddleware');
const userOfficeController = require('../controllers/userOfficeController');
const imageController = require('../controllers/imageController');

router.post('/login', userOfficeController.login);
router.get('/current-user', authOfficeMiddleware, userOfficeController.currentUser);
router.get('/logout', authOfficeMiddleware, userOfficeController.logout);
router.post('/:imagepath/upload', authOfficeMiddleware, imageController.singleImageUpload, userOfficeController.uploadUserImage);
router.put('/otp-request', userOfficeController.otpRequestEmail);
router.put('/otp-verify', userOfficeController.verifyOtp);
router.post('/sso-login', userOfficeController.ssoFirebaseLogin);

module.exports = router;