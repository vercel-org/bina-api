const multer = require('multer')

const storageConfig = (path, maxFileSize, allowedFileTypes) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/data/uploads/${path}/`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });

  const upload = multer({
    storage: diskStorage,
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, cb) => {
      // Check if the file's type is allowed
      if (!allowedFileTypes.test(file.originalname.toLowerCase())) {
        return cb(new Error('INVALID_FORMAT'));
      }
      cb(null, true);
    }
  });

  return upload;
};

module.exports = storageConfig
