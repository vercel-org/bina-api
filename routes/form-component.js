const express = require('express')
const router = express.Router()
const {createComponent,getComponent} = require('../controllers/component')


router.route('/component/create').post(createComponent)

//get component by country parameter
router.route('/component/get').get(getComponent)

module.exports = router