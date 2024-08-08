const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const userOfficeController = require('../controllers/userOfficeController');
const imageController = require('../controllers/imageController');


router.post('/user', userOfficeController.createUser);
router.post('/login', userOfficeController.login);
router.post('/logout', userOfficeController.logout);
router.get('/current-user', authMiddleware, userOfficeController.currentUser);
router.get('/user', authMiddleware, userOfficeController.getAllUsers);
router.get('/user/:id', authMiddleware, userOfficeController.getUserById);
router.put('/user/:id', authMiddleware, userOfficeController.updateUser);
router.delete('/user/:id', authMiddleware, userOfficeController.deleteUser);
router.put('/otp-request', userOfficeController.otpRequestEmail);
router.put('/otp-verify', userOfficeController.verifyOtp);
router.post('/user/:imagepath/:id', authMiddleware, imageController.singleImageUpload, userOfficeController.uploadUserImage);
router.get('/logout', authMiddleware, userOfficeController.logout);

module.exports = router;