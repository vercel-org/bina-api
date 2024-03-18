const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createNewsEvent,allowedFileTypes,maxFileSize, getNewsEventList, updateNewsEvent, getNewsEvent } = require('../controllers/news-event');
const storageConfig = require('../middleware/multer-storage');


const upload = multer(storageConfig('news-event', maxFileSize,allowedFileTypes));
 
// Define route for registration form submission
router.post('/news-event/create', upload.array('pictures'), createNewsEvent);
router.get('/news-event-list',getNewsEventList)
router.get('/news-event',getNewsEvent)
router.patch('/news-event/update', upload.array('pictures'), updateNewsEvent)


module.exports = router;
