import express from 'express';
import { saveImage } from '../controllers/imageController';
import { upload } from '../utils/fileUpload';

const router = express.Router();

router.post('/task', upload.single('image'), saveImage);

export default router;
