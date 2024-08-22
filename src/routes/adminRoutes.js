const router = require('express').Router();
const { authAdminMiddleware } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Multer
// const multer = require('multer');
// const crypto = require('crypto');
// const path = require('path');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './assets/images/profile_images');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const randomBytes = crypto.randomBytes(8).toString('hex');
//         const newFilename = `${file.fieldname}_${uniqueSuffix}_${randomBytes}${path.extname(file.originalname)}`;

//         return cb(null, newFilename);
//     }
// });
// const upload = multer({ storage: storage });

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
// Service
router.get('/service-list', authAdminMiddleware, adminController.serviceList);
router.post('/service-create', authAdminMiddleware, adminController.serviceCreate);
router.post('/service-update', authAdminMiddleware, adminController.serviceUpdate);
router.post('/service-delete', authAdminMiddleware, adminController.serviceDelete);
// Office User
router.get('/office-user-list', authAdminMiddleware, adminController.officeUserList);
router.post('/office-user-create', authAdminMiddleware, adminController.officeUserCreate);
// router.post('/office-user-update', authAdminMiddleware, upload.single('profile_image'), adminController.officeUserUpdate);
router.post('/office-user-update', authAdminMiddleware, adminController.officeUserUpdate);
router.post('/office-user-delete', authAdminMiddleware, adminController.officeUserDelete);
// Office Agent
router.get('/agent-user-list', authAdminMiddleware, adminController.agentUserList);
router.post('/agent-user-create', authAdminMiddleware, adminController.agentUserCreate);
router.post('/agent-user-update', authAdminMiddleware, adminController.agentUserUpdate);
router.post('/agent-user-delete', authAdminMiddleware, adminController.agentUserDelete);
// Queue Service
router.get('/queue-service-list', authAdminMiddleware, adminController.queueServiceList);
router.post('/queue-service-create', authAdminMiddleware, adminController.queueServiceCreate);
router.post('/queue-service-update', authAdminMiddleware, adminController.queueServiceUpdate);
router.post('/queue-service-delete', authAdminMiddleware, adminController.queueServiceDelete);
// WT News
router.get('/wt-news-list', authAdminMiddleware, adminController.WTnewsList);
router.post('/wt-news-create', authAdminMiddleware, adminController.WTnewsCreate);
router.post('/wt-news-update', authAdminMiddleware, adminController.WTnewsUpdate);
router.post('/wt-news-delete', authAdminMiddleware, adminController.WTnewsDelete);
// WT Video
router.get('/wt-video-list', authAdminMiddleware, adminController.WTvideoList);
router.post('/wt-video-create', authAdminMiddleware, adminController.WTvideoCreate);
router.post('/wt-video-update', authAdminMiddleware, adminController.WTvideoUpdate);
router.post('/wt-video-delete', authAdminMiddleware, adminController.WTvideoDelete);

module.exports = router;