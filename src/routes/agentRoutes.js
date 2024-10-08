const router = require('express').Router();
const { authAgentMiddleware } = require('../middleware/authMiddleware');
const agentController = require('../controllers/agentController');

router.post('/get-counter', authAgentMiddleware, agentController.getCounter);
router.post('/set-counter', authAgentMiddleware, agentController.setCounter);
router.post('/revoke-counter', authAgentMiddleware, agentController.revokeCounter);
router.post('/get-waiting-list', authAgentMiddleware, agentController.getWaitingList);
router.post('/reserve-queue', authAgentMiddleware, agentController.reserveQueue);
router.post('/get-reserve-queue', authAgentMiddleware, agentController.getReserveQueue);
router.post('/complete-queue', authAgentMiddleware, agentController.completeQueue);
router.post('/cancel-queue', authAgentMiddleware, agentController.cancelQueue);
router.post('/get-online-counter', authAgentMiddleware, agentController.getOnlineCounter);
router.post('/tranfer-queue', authAgentMiddleware, agentController.transferQueue);

module.exports = router;