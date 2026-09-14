import { getSupabaseAdminClient, isSupabaseConfigured } from '../lib/supabase/admin';

export class UploadsService {
  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'project-media'
  ): Promise<{ url: string; fileName: string; size: number }> {
    const adminClient = getSupabaseAdminClient();
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `uploads/${timestamp}-${sanitizedFileName}`;

    if (adminClient && isSupabaseConfigured()) {
      try {
        if (process.env.NODE_ENV === 'production') {
          const { data: bucket, error: bucketError } = await adminClient.storage.getBucket(bucketName);
          if (bucketError || !bucket?.public) throw new Error('Public media storage is unavailable');
        }
        const { data, error } = await adminClient.storage
          .from(bucketName)
          .upload(storagePath, fileBuffer, {
            contentType: mimeType,
            upsert: false,
          });

        if (!error && data) {
          const { data: publicUrlData } = adminClient.storage
            .from(bucketName)
            .getPublicUrl(data.path);

          if (!publicUrlData?.publicUrl) throw new Error('Media URL is unavailable');

          return {
            url: publicUrlData.publicUrl,
            fileName: sanitizedFileName,
            size: fileBuffer.length,
          };
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Media storage is unavailable. Please try again later.');
        }
      }
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Media storage is unavailable. Please try again later.');
    }

    // Fallback: Data URL
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      url: dataUrl,
      fileName: sanitizedFileName,
      size: fileBuffer.length,
    };
  }
}
