const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createCountry,allowedFileTypes,maxFileSize, getCountries, updateCountry, getCountry } = require('../controllers/country');
const storageConfig = require('../middleware/multer-storage');


const upload = multer(storageConfig('country', maxFileSize,allowedFileTypes));


// Configure multer with cvStorage
//const upload = multer({ storage: storageConfig('country') });

// Define route for registration form submission
router.post('/country/create', upload.single('picture'), createCountry);
router.get('/countries',getCountries)
router.get('/country',getCountry)
router.patch('/country/update', upload.single('picture'), updateCountry)



module.exports = router;
