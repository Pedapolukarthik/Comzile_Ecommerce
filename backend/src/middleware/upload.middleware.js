const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/appError');

const baseUploadDir = path.join(__dirname, '../../uploads');
const categoryUploadDir = path.join(baseUploadDir, 'categories');
const productUploadDir = path.join(baseUploadDir, 'products');

[baseUploadDir, categoryUploadDir, productUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl && req.originalUrl.includes('categories')) {
      cb(null, categoryUploadDir);
    } else {
      cb(null, productUploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed!', 400), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

module.exports = upload;
