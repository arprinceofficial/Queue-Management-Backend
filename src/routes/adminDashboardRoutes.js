const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const adminDashboardController = require('../controllers/adminDashboardController');
const chatGPTController = require('../controllers/chatGptController');

router.get('/menu/:id', authMiddleware, adminDashboardController.menu)
router.post('/menu', authMiddleware, adminDashboardController.createMenu)
router.put('/menu/:id', authMiddleware, adminDashboardController.updateMenu)
router.delete('/menu/:id', authMiddleware, adminDashboardController.deleteMenu)

// Chat GPT
router.post('/chat-gpt', chatGPTController.chatGPT)
// Test send message to client (socket.io)
router.post('/test-emit', adminDashboardController.sendMessageEmitSocketIO)

module.exports = router;