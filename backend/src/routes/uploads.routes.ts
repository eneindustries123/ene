import { Router } from 'express';
import multer from 'multer';
import { UploadsController } from '../controllers/uploads.controller';
import { requireAdminAuth } from '../middleware/auth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export const uploadsRouter = Router();

uploadsRouter.post('/', requireAdminAuth, upload.single('file'), UploadsController.uploadMedia);
