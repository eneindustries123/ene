import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import { signToken } from '../src/middleware/auth';
import { UploadsService } from '../src/services/uploads.service';

const storage = vi.hoisted(() => ({ configured: true, bucket: vi.fn(), upload: vi.fn() }));
vi.mock('../src/lib/supabase/admin', () => ({
  isSupabaseConfigured: () => storage.configured,
  getSupabaseAdminClient: () => storage.configured ? { storage: {
    getBucket: storage.bucket,
    from: () => ({ upload: storage.upload, getPublicUrl: () => ({ data: {
      publicUrl: 'https://example.supabase.co/storage/v1/object/public/project-media/image.png',
    } }) }),
  } } : null,
}));

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('ADMIN_EMAIL', 'admin@example.com');
  vi.stubEnv('AUTH_SECRET', 'test-only-secret');
  storage.configured = true;
  storage.bucket.mockReset().mockResolvedValue({ data: { public: true }, error: null });
  storage.upload.mockReset().mockResolvedValue({ data: { path: 'image.png' }, error: null });
});
afterEach(() => vi.unstubAllEnvs());
const upload = () => UploadsService.uploadFile(Buffer.from('image'), 'image.png', 'image/png');

describe('production media storage must confirm upload success', () => {
  it.each(['image/webp', 'image/jpeg', 'image/png'])('accepts authenticated %s uploads and preserves their MIME type', async (contentType) => {
    const token = signToken({ email: 'admin@example.com', exp: Date.now() + 60000 });
    const response = await request(app).post('/api/uploads').set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('test-image'), { filename: 'image', contentType });
    expect(response.status).toBe(200);
    expect(response.body.url).toMatch(/^https:.*\/storage\/v1\/object\/public\//);
    expect(storage.upload).toHaveBeenCalledWith(expect.any(String), expect.any(Buffer), { contentType, upsert: false });
  });
  it('returns a Storage URL on successful persistent upload', async () => {
    expect((await upload()).url).toMatch(/^https:.*\/storage\/v1\/object\/public\//);
    expect(storage.upload).toHaveBeenCalledTimes(1);
  });
  it('fails explicitly without configured storage', async () => {
    storage.configured = false;
    await expect(upload()).rejects.toThrow('Media storage is unavailable');
  });
  it.each([
    { data: null, error: { message: 'Bucket not found' } },
    { data: { public: false }, error: null },
  ])('rejects a missing or private bucket before attempting upload', async (response) => {
    storage.bucket.mockResolvedValue(response);
    await expect(upload()).rejects.toThrow('Media storage is unavailable');
    expect(storage.upload).not.toHaveBeenCalled();
  });
  it('does not turn a rejected Storage upload into data-URL success', async () => {
    storage.upload.mockResolvedValue({ data: null, error: { message: 'private failure details' } });
    await expect(upload()).rejects.toThrow('Media storage is unavailable');
  });
  it('does not turn a network exception into data-URL success', async () => {
    storage.upload.mockRejectedValue(new Error('private network details'));
    await expect(upload()).rejects.toThrow('Media storage is unavailable');
  });
  it('returns a generic HTTP failure to the authenticated CMS without a URL', async () => {
    storage.bucket.mockResolvedValue({ data: null, error: { message: 'private bucket details' } });
    const token = signToken({ email: 'admin@example.com', exp: Date.now() + 60000 });
    const response = await request(app).post('/api/uploads').set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('image'), 'image.png');
    expect(response.status).toBe(500);
    expect(response.body.url).toBeUndefined();
    expect(response.text).not.toContain('data:image');
    expect(response.text).not.toContain('private bucket details');
  });
  it('keeps fixture fallback isolated to development/test', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    storage.configured = false;
    expect((await upload()).url).toBe('data:image/png;base64,aW1hZ2U=');
  });
});
