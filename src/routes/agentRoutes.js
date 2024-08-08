const router = require('express').Router();
const { authAgentMiddleware } = require('../middleware/authAgentMiddleware');
const agentController = require('../controllers/agentController');

module.exports = router;