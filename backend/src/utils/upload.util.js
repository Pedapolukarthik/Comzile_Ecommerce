const path = require('path');

const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');
  return `${name}_${Date.now()}${ext}`;
};

const sanitizeFilePath = (filePath) => {
  return path.normalize(filePath).replace(/^(\.\.(\/|\\))+/, '');
};

module.exports = {
  generateFileName,
  sanitizeFilePath
};
