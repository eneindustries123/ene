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

          return {
            url: publicUrlData.publicUrl,
            fileName: sanitizedFileName,
            size: fileBuffer.length,
          };
        }
      } catch (err) {
        console.warn('Supabase storage upload error, using fallback:', err);
      }
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
