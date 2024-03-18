const express = require('express')
const router = express.Router()
const {createUser, getUsers, getUser} = require('../controllers/user')


router.route('/user/create').post(createUser)
router.route('/users').get(getUsers)
router.route('/user').get(getUser)


module.exports = router