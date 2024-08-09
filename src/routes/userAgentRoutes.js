const router = require('express').Router();
const { authAgentMiddleware } = require('../middleware/authMiddleware');
const userAgentController = require('../controllers/userAgentController');
const imageController = require('../controllers/imageController');

router.post('/login', userAgentController.login);
router.get('/current-user', authAgentMiddleware, userAgentController.currentUser);
router.get('/logout', authAgentMiddleware, userAgentController.logout);
router.post('/:imagepath/upload', authAgentMiddleware, imageController.singleImageUpload, userAgentController.uploadUserImage);
router.put('/otp-request', userAgentController.otpRequestEmail);
router.put('/otp-verify', userAgentController.verifyOtp);

module.exports = router;