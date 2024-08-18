const router = require('express').Router();
const { authAdminMiddleware } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Counter
router.get('/counter-list', authAdminMiddleware, adminController.counterList);
router.post('/counter-create', authAdminMiddleware, adminController.counterCreate);
router.post('/counter-update', authAdminMiddleware, adminController.counterUpdate);
router.post('/counter-delete', authAdminMiddleware, adminController.counterDelete);
// Office
router.get('/office-list-all', authAdminMiddleware, adminController.officeListAll);
router.get('/office-list', authAdminMiddleware, adminController.officeList);
router.post('/office-create', authAdminMiddleware, adminController.officeCreate);
router.post('/office-update', authAdminMiddleware, adminController.officeUpdate);
router.post('/office-delete', authAdminMiddleware, adminController.officeDelete);
// Priority
router.get('/priority-list', authAdminMiddleware, adminController.priorityList);
router.post('/priority-create', authAdminMiddleware, adminController.priorityCreate);
router.post('/priority-update', authAdminMiddleware, adminController.priorityUpdate);
router.post('/priority-delete', authAdminMiddleware, adminController.priorityDelete);
// Gender
router.get('/gender-list', authAdminMiddleware, adminController.genderList);
router.post('/gender-create', authAdminMiddleware, adminController.genderCreate);
router.post('/gender-update', authAdminMiddleware, adminController.genderUpdate);
router.post('/gender-delete', authAdminMiddleware, adminController.genderDelete);
// Office User
router.get('/office-user-list', authAdminMiddleware, adminController.officeUserList);
router.post('/office-user-create', authAdminMiddleware, adminController.officeUserCreate);
router.post('/office-user-update', authAdminMiddleware, adminController.officeUserUpdate);
router.post('/office-user-delete', authAdminMiddleware, adminController.officeUserDelete);

module.exports = router;