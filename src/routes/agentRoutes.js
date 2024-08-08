const router = require('express').Router();
const { authAgentMiddleware } = require('../middleware/authAgentMiddleware');
const agentController = require('../controllers/agentController');

router.post('/get-counter', authAgentMiddleware, agentController.getCounter);
router.post('/set-counter', authAgentMiddleware, agentController.setCounter);
router.post('/revoke-counter', authAgentMiddleware, agentController.revokeCounter);

module.exports = router;