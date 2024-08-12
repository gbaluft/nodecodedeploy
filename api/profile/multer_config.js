import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads')); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.mp3') {
      return cb(new Error('Only images and MP3 files are allowed'), false);
    }
    cb(null, true);
  }
});

const multipleUpload = upload.fields([
  { name: 'auditoryStimulus', maxCount: 1 },
  { name: 'auditoryFeedback', maxCount: 1 },
  { name: 'visualFeedback', maxCount: 1 },
  { name: 'appreciationFeedback', maxCount: 1 },
  { name: 'stimulusFile1', maxCount: 1 },
  { name: 'stimulusFile2', maxCount: 1 },
  { name: 'stimulusFile3', maxCount: 1 }
]);

export default multipleUpload;