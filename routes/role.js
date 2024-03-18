const express = require('express')
const router = express.Router()
const {createRole, getRoles, getRole, updateRole} = require('../controllers/role')

// router.post('/role/create',createRole)
// router.get('/roles',getRoles)('/role',getRole)
// router.patch('/role/update',updateRole)


router.route('/role/create').post(createRole)
router.route('/roles').get(getRoles)
router.route('/role').get(getRole)
router.route('/role/update').patch(updateRole)

module.exports = router;