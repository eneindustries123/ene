import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import { SolarAnalyzerController } from '../controllers/solarAnalyzer.controller';
import { solarAnalyzerExtractionRateLimiter, publicApiRateLimiter } from '../middleware/rateLimit';
import { getSolarAnalyzerMaxFileBytes } from '../services/solarAnalyzerFile.service';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: getSolarAnalyzerMaxFileBytes(),
  },
});

export const solarAnalyzerRouter = Router();

solarAnalyzerRouter.get('/config', SolarAnalyzerController.config);
solarAnalyzerRouter.post(
  '/extract',
  solarAnalyzerExtractionRateLimiter,
  upload.single('bill'),
  SolarAnalyzerController.extract
);
solarAnalyzerRouter.post(
  '/recommend',
  publicApiRateLimiter,
  SolarAnalyzerController.recommend
);

solarAnalyzerRouter.use(
  (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'The bill exceeds the maximum allowed file size.',
          code: 'FILE_TOO_LARGE',
        });
      }
      return res.status(400).json({
        error: 'The bill upload could not be processed.',
        code: 'INVALID_UPLOAD',
      });
    }
    return next(error);
  }
);
