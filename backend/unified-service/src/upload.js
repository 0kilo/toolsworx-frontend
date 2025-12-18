const multer = require('multer');
const { TEMP_DIR, MAX_FILE_SIZE, MAX_MEDIA_SIZE, MAX_AUDIO_SIZE } = require('./config');

const uploadAny = multer({
  dest: TEMP_DIR,
  limits: { fileSize: MAX_MEDIA_SIZE }
});

const uploadFileOnly = multer({
  dest: TEMP_DIR,
  limits: { fileSize: MAX_FILE_SIZE }
});

const uploadAudioOnly = multer({
  dest: TEMP_DIR,
  limits: { fileSize: MAX_AUDIO_SIZE }
});

module.exports = {
  uploadAny,
  uploadFileOnly,
  uploadAudioOnly,
};
