const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const imageController = require('../controllers/imageController');


router.post('/user', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/current-user', authMiddleware, userController.currentUser);
router.get('/user', authMiddleware, userController.getAllUsers);
router.get('/user/:id', authMiddleware, userController.getUserById);
router.put('/user/:id', authMiddleware, userController.updateUser);
router.delete('/user/:id', authMiddleware, userController.deleteUser);
router.put('/otp-request', userController.otpRequestEmail);
router.put('/otp-verify', userController.verifyOtp);
router.post('/user/:imagepath/:id', authMiddleware, imageController.singleImageUpload, userController.uploadUserImage);
router.get('/logout', authMiddleware, userController.logout);

module.exports = router;