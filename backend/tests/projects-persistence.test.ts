import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import { signToken } from '../src/middleware/auth';
import { ProjectsService } from '../src/services/projects.service';

const storage = vi.hoisted(() => ({ configured: true, client: true, replies: [] as any[], queries: [] as any[] }));
vi.mock('../src/lib/supabase/admin', () => ({
  isSupabaseConfigured: () => storage.configured,
  getSupabaseAdminClient: () => storage.client ? {
    from: (table: string) => {
      const calls: any[] = [['from', table]];
      storage.queries.push(calls);
      const result = () => {
        if (!storage.replies.length) throw new Error('Unexpected database query');
        return storage.replies.shift();
      };
      const query: any = { then: (resolve: any, reject: any) => Promise.resolve().then(result).then(resolve, reject) };
      for (const name of ['select', 'eq', 'neq', 'order', 'limit', 'insert', 'update', 'delete', 'returns']) {
        query[name] = (...args: any[]) => { calls.push([name, ...args]); return query; };
      }
      query.single = query.maybeSingle = () => Promise.resolve().then(result);
      return query;
    },
  } : null,
}));

const id = '11111111-1111-4111-8111-111111111111';
const payload = {
  title: 'MNS University of Agriculture Multan', slug: 'mns-university-of-agriculture-multan',
  client: 'University', location: 'Multan', capacity: '100 kW', category: 'Institutional Solar',
  completionYear: 2024, summary: 'A verified project description.', fullStory: '',
  mainImage: '/images/projects/p1-1.jpg', gallery: ['/images/projects/p1-2.jpg'],
  isFeatured: false, status: 'published' as const,
};
const row = { ...payload, id, completion_year: 2024, main_image: payload.mainImage, is_featured: false };
const ok = (data: any, count?: number) => ({ data, error: null, count });
const authorization = () => `Bearer ${signToken({ email: 'admin@example.com', exp: Date.now() + 60000 })}`;

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('ADMIN_EMAIL', 'admin@example.com');
  vi.stubEnv('ADMIN_PASSWORD', 'test-only-password');
  vi.stubEnv('AUTH_SECRET', 'test-only-secret-not-a-production-credential');
  storage.configured = storage.client = true;
  storage.replies = []; storage.queries = [];
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('production projects use persistent storage exclusively', () => {
  it('opts directory reads into a single published-only projection without changing full reads', async () => {
    storage.replies = [ok([{ ...row, main_image: undefined, gallery: undefined, full_story: undefined }]), ok([{ ...row, full_story: 'Complete story' }])];
    const directory = await request(app).get('/api/projects?view=directory');
    expect(directory.status).toBe(200);
    expect(directory.body[0]).toMatchObject({ mainImage: `/api/projects/${id}/image`, gallery: [], fullStory: '', status: 'published' });
    expect(directory.text).not.toContain('data:image');
    expect(storage.queries).toHaveLength(1);
    expect(storage.queries[0]).toContainEqual(['eq', 'status', 'published']);
    expect(storage.queries[0]).toContainEqual(['order', 'created_at', { ascending: false }]);
    const projection = storage.queries[0].find((call: any[]) => call[0] === 'select')[1].split(',');
    expect(projection).not.toContain('main_image');
    expect(projection).not.toContain('gallery');
    expect(projection).not.toContain('full_story');
    const full = await request(app).get('/api/projects?status=published');
    expect(full.body[0]).toMatchObject({ gallery: payload.gallery, fullStory: 'Complete story' });
    expect(storage.queries[1]).toContainEqual(['select', '*']);
  });

  it('delivers existing embedded images as binary without changing full project detail', async () => {
    const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const image = `data:image/png;base64,${bytes.toString('base64')}`;
    storage.replies = [ok({ main_image: image }), ok({ ...row, main_image: image })];
    const response = await request(app).get(`/api/projects/${id}/image`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(bytes);
    expect(response.headers['content-type']).toContain('image/png');
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['cross-origin-resource-policy']).toBe('cross-origin');
    expect(response.headers['content-security-policy']).toContain('sandbox');
    expect(storage.queries[0]).toContainEqual(['select', 'main_image']);
    expect(storage.queries[0]).toContainEqual(['eq', 'id', id]);
    expect(storage.queries[0]).toContainEqual(['eq', 'status', 'published']);
    const detail = await request(app).get(`/api/projects/${id}`);
    expect(detail.body.mainImage).toBe(image);
    expect(detail.body.gallery).toEqual(payload.gallery);
  });

  it.each(['draft', 'archived', null])('does not expose an image excluded by publication filtering: %s', async () => {
    storage.replies = [ok(null)];
    const response = await request(app).get(`/api/projects/${id}/image`).set('Authorization', authorization());
    expect(response.status).toBe(404);
    expect(storage.queries[0]).toContainEqual(['eq', 'status', 'published']);
  });

  it('rejects invalid image IDs without querying and hides database errors', async () => {
    expect((await request(app).get('/api/projects/not-a-uuid/image')).status).toBe(404);
    expect(storage.queries).toHaveLength(0);
    storage.replies = [{ data: null, error: { message: 'private database details' } }];
    const response = await request(app).get(`/api/projects/${id}/image`);
    expect(response.status).toBe(503);
    expect(response.text).not.toContain('private database details');
  });

  it.each([
    ['/images/projects/p1-1.jpg', 'https://www.eneindustries.com/images/projects/p1-1.jpg'],
    ['https://example.supabase.co/storage/v1/object/public/project-media/a.png', 'https://example.supabase.co/storage/v1/object/public/project-media/a.png'],
  ])('redirects an existing image reference without proxying it: %s', async (stored, expected) => {
    vi.stubEnv('FRONTEND_URL', 'https://www.eneindustries.com');
    storage.replies = [ok({ main_image: stored })];
    const response = await request(app).get(`/api/projects/${id}/image`);
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(expected);
  });

  it.each(['javascript:alert(1)', 'data:text/html;base64,SGVsbG8=', 'data:image/png;base64,invalid!'])('does not serve unsafe image references: %s', async (stored) => {
    storage.replies = [ok({ main_image: stored })];
    expect((await request(app).get(`/api/projects/${id}/image`)).status).toBe(404);
  });

  it('never substitutes directory fixtures when storage is missing, even in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    storage.configured = false;
    await expect(ProjectsService.getPublishedProjects(true)).rejects.toThrow('unavailable');
  });
  it('preserves empty lists, detail misses and zero featured counts', async () => {
    storage.replies = [ok([]), ok([]), ok([]), ok(null, 0), ok(null), ok(null)];
    expect(await ProjectsService.getAllProjects()).toEqual([]);
    expect(await ProjectsService.getPublishedProjects()).toEqual([]);
    expect(await ProjectsService.getFeaturedPublishedProjects()).toEqual([]);
    expect(await ProjectsService.countPublishedFeaturedProjects()).toBe(0);
    expect(await ProjectsService.getProjectBySlug(payload.slug)).toBeNull();
    expect(await ProjectsService.getProjectById(id)).toBeNull();
  });
  it('accepts a historical seed slug when the database reports no match', async () => {
    storage.replies = [ok([])];
    expect(await ProjectsService.isSlugUnique(payload.slug)).toBe(true);
    expect(storage.queries[0]).toContainEqual(['eq', 'slug', payload.slug]);
  });
  it('rejects an actual duplicate and excludes only a persisted UUID on update', async () => {
    storage.replies = [ok([{ id }]), ok([]), ok([{ id }])];
    expect(await ProjectsService.isSlugUnique(payload.slug)).toBe(false);
    expect(await ProjectsService.isSlugUnique(payload.slug, id)).toBe(true);
    expect(storage.queries[1]).toContainEqual(['neq', 'id', id]);
    expect(await ProjectsService.isSlugUnique(payload.slug, 'proj-1')).toBe(false);
    expect(storage.queries[2].some((c: any[]) => c[0] === 'neq')).toBe(false);
  });
  it('returns 201 with the persisted UUID, then rejects a real duplicate', async () => {
    storage.replies = [ok([]), ok(row)];
    const created = await request(app).post('/api/projects').set('Authorization', authorization()).send(payload);
    expect(created.status).toBe(201);
    expect(created.body.id).toBe(id);
    expect(storage.queries[1]).toContainEqual(['insert', expect.objectContaining({ slug: payload.slug, is_published: true })]);
    storage.replies = [ok([{ id }])];
    const duplicate = await request(app).post('/api/projects').set('Authorization', authorization()).send(payload);
    expect(duplicate.status).toBe(409);
  });
  it('maps a database unique violation after a racing pre-check to 409', async () => {
    storage.replies = [ok([]), { data: null, error: { code: '23505', message: 'duplicate key' } }];
    const result = await request(app).post('/api/projects').set('Authorization', authorization()).send(payload);
    expect(result.status).toBe(409);
    expect(result.body.error).toBe('A project with this URL slug already exists');
  });
  it('does not return creation success for failed or unconfirmed inserts', async () => {
    for (const reply of [{ data: null, error: { message: 'offline' } }, ok(null)]) {
      storage.replies = [ok([]), reply];
      const result = await request(app).post('/api/projects').set('Authorization', authorization()).send(payload);
      expect(result.status).toBe(500);
    }
  });
  const operations = [
    () => ProjectsService.getAllProjects(), () => ProjectsService.getPublishedProjects(),
    () => ProjectsService.getFeaturedPublishedProjects(), () => ProjectsService.countPublishedFeaturedProjects(),
    () => ProjectsService.getProjectById(id), () => ProjectsService.getProjectBySlug(payload.slug),
    () => ProjectsService.isSlugUnique(payload.slug), () => ProjectsService.createProject(payload),
    () => ProjectsService.updateProject(id, { title: 'Updated title' }), () => ProjectsService.deleteProject(id),
  ];
  it('fails all production operations when configuration or client is unavailable', async () => {
    storage.configured = false;
    for (const operation of operations) await expect(operation()).rejects.toThrow();
    storage.configured = true; storage.client = false;
    for (const operation of operations) await expect(operation()).rejects.toThrow();
    expect(storage.queries).toHaveLength(0);
  });
  it('propagates all database operation failures rather than consulting seeds', async () => {
    for (const operation of operations) {
      storage.replies = [{ data: null, error: { message: 'offline' } }];
      await expect(operation()).rejects.toThrow();
    }
  });
  it('updates only valid schema fields and synchronizes status without updated_at', async () => {
    storage.replies = [ok({ ...row, status: 'draft' })];
    await ProjectsService.updateProject(id, { title: 'New title', status: 'draft' });
    expect(storage.queries[0]).toContainEqual(['update', { title: 'New title', status: 'draft', is_published: false }]);
    expect(storage.queries[0]).toContainEqual(['eq', 'id', id]);
  });
  it('does not report missing updates/deletes as successful persisted operations', async () => {
    storage.replies = [ok(null), ok([]), ok([{ id }])];
    expect(await ProjectsService.updateProject(id, { title: 'New title' })).toBeNull();
    expect(await ProjectsService.deleteProject(id)).toBe(false);
    expect(await ProjectsService.deleteProject(id)).toBe(true);
    expect(await ProjectsService.updateProject('proj-1', { title: 'New title' })).toBeNull();
    expect(await ProjectsService.deleteProject('proj-1')).toBe(false);
  });
  it('queries exact published status publicly and returns all statuses to an authenticated admin', async () => {
    storage.replies = [ok([row])];
    const publicList = await request(app).get('/api/projects');
    expect(publicList.body.map((p: any) => p.status)).toEqual(['published']);
    expect(storage.queries[0]).toContainEqual(['eq', 'status', 'published']);
    storage.replies = [ok(['published', 'draft', 'archived', null].map(status => ({ ...row, status })))];
    const adminList = await request(app).get('/api/projects').set('Authorization', authorization());
    expect(adminList.status).toBe(200);
    expect(adminList.body).toHaveLength(4);
    expect(storage.queries[1]).not.toContainEqual(['eq', 'status', 'published']);
  });
  it.each(['draft', 'archived', null])('hides %s details from public callers', async status => {
    storage.replies = [ok({ ...row, status })];
    const result = await request(app).get(`/api/projects/${id}`);
    expect(result.status).toBe(404);
  });
  it('rejects an invalid forwarded admin token instead of returning a public list', async () => {
    const result = await request(app).get('/api/projects').set('Authorization', 'Bearer invalid-session');
    expect(result.status).toBe(401);
    expect(storage.queries).toHaveLength(0);
  });
  it('requires authentication for mutations', async () => {
    for (const result of [await request(app).post('/api/projects').send(payload), await request(app).delete(`/api/projects/${id}`)]) {
      expect(result.status).toBe(401);
    }
    expect(storage.queries).toHaveLength(0);
  });
});
