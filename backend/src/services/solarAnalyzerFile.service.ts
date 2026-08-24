import path from 'path';

export const SOLAR_ANALYZER_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);

export class SolarAnalyzerError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'SolarAnalyzerError';
  }
}

export function getSolarAnalyzerMaxFileBytes(): number {
  const configuredMb = Number(process.env.SOLAR_ANALYZER_MAX_FILE_MB);
  const maxMb = Number.isFinite(configuredMb) && configuredMb > 0 ? configuredMb : 10;
  return Math.floor(maxMb * 1024 * 1024);
}

function hasPdfSignature(buffer: Buffer): boolean {
  if (buffer.length < 8 || buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    return false;
  }
  const tail = buffer.subarray(Math.max(0, buffer.length - 2048)).toString('latin1');
  return tail.includes('%%EOF');
}

function hasJpegSignature(buffer: Buffer): boolean {
  return buffer.length >= 4 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;
}

function hasPngSignature(buffer: Buffer): boolean {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return buffer.length >= signature.length &&
    signature.every((byte, index) => buffer[index] === byte);
}

export function validateSolarBillFile(file: Express.Multer.File): void {
  if (!file.buffer || file.size <= 0 || file.buffer.length <= 0) {
    throw new SolarAnalyzerError('The uploaded bill is empty.', 400, 'EMPTY_FILE');
  }

  if (file.size > getSolarAnalyzerMaxFileBytes()) {
    throw new SolarAnalyzerError(
      'The bill exceeds the maximum allowed file size.',
      413,
      'FILE_TOO_LARGE'
    );
  }

  const extension = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new SolarAnalyzerError(
      'Unsupported file extension. Upload a PDF, JPG, JPEG, or PNG bill.',
      400,
      'UNSUPPORTED_FILE_EXTENSION'
    );
  }

  if (!SOLAR_ANALYZER_ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
    throw new SolarAnalyzerError(
      'Unsupported file type. Upload a PDF, JPG, JPEG, or PNG bill.',
      400,
      'UNSUPPORTED_MIME_TYPE'
    );
  }

  const signatureMatches = file.mimetype === 'application/pdf'
    ? hasPdfSignature(file.buffer)
    : file.mimetype === 'image/png'
      ? hasPngSignature(file.buffer)
      : hasJpegSignature(file.buffer);

  if (!signatureMatches) {
    throw new SolarAnalyzerError(
      'The uploaded file appears corrupted or does not match its declared type.',
      400,
      'INVALID_FILE_SIGNATURE'
    );
  }
}
