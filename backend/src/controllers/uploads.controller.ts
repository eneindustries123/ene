import { Request, Response } from 'express';
import { UploadsService } from '../services/uploads.service';

export class UploadsController {
  static async uploadMedia(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Check mime type (Images & Videos)
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/ogg',
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: 'Invalid file type. Only JPEG, PNG, WEBP, SVG images and MP4, WEBM, MOV, OGG videos are allowed.',
        });
      }

      const result = await UploadsService.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      return res.status(200).json({
        url: result.url,
        fileName: result.fileName,
        size: result.size,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'File upload failed' });
    }
  }
}
