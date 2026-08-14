import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image format (${file.type}). Allowed: JPG, PNG, WEBP, GIF, AVIF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension
    let ext = path.extname(file.name).toLowerCase();
    if (!ext || ext === '.') {
      ext = file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg';
    }

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeFilename = `proj-${Date.now()}-${uniqueId}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, safeFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/projects/${safeFilename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename: safeFilename });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to upload media file' },
      { status: 500 }
    );
  }
}
