import { Router } from 'express';
import multer from 'multer';
import { UploadsController } from '../controllers/uploads.controller';
import { requireAdminAuth } from '../middleware/auth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const uploadsRouter = Router();

uploadsRouter.post('/', requireAdminAuth, upload.single('file'), UploadsController.uploadMedia);
