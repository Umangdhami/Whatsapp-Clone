const multer = require('multer');
const dotenv = require('dotenv')
dotenv.config()
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, `${process.env.PROFILE_IMAGE}`));
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + Math.round(Math.random() * 100000) + "-" + file.originalname;
    cb(null, fileName);
  },
});

const uploadProfile = multer({ storage }).single("profile_pic");

module.exports = { uploadProfile };
