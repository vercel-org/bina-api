const express = require('express')
const router = express.Router()
const {createJobOrder} = require('../controllers/job-order')


router.route('/job-order/create').post(createJobOrder)


module.exports = router