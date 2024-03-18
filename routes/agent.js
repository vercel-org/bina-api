const express = require('express')
const router = express.Router()
const {createAgent, getAgents, getAgent, updateAgent} = require('../controllers/agent')


router.route('/agent/create').post(createAgent)
router.get('/agents',getAgents)
router.get('/agent',getAgent)
router.patch('/agent/update',updateAgent)

module.exports = router