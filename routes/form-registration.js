const express = require('express')
const router = express.Router()
const {createJobRegistration,allowedFileTypes,maxFileSize} = require('../controllers/job-registration')

const multer = require('multer');
const storageConfig = require('../middleware/multer-storage');


const upload = multer(storageConfig('cv', maxFileSize,allowedFileTypes));


// Configure multer with cvStorage
//const upload = multer({ storage: storageConfig('country') });

// Define route for registration form submission
router.post('/register', upload.single('cv'), createJobRegistration);


module.exports = router