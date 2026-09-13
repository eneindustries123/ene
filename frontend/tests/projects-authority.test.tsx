import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from '../app/admin/page';
import { INITIAL_PROJECTS } from '../lib/data';
import { getAllProjects, getProjectById, getProjectBySlug, createProject, updateProject, deleteProject } from '../lib/projects-store';

const { adminFetch } = vi.hoisted(() => ({ adminFetch: vi.fn() }));
vi.mock('../lib/admin-server-api', () => ({ fetchAdminBackend: adminFetch }));
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production');
  adminFetch.mockReset();
  adminFetch.mockImplementation(async () => Response.json([]));
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No live requests allowed'));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

const values = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

describe('project authority and dashboard', () => {
  it('preserves a successful empty API result instead of eight fallback projects', async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json([]));
    expect(await getAllProjects()).toEqual([]);
  });
  it('renders zero published, featured and total counts for an empty database', async () => {
    const html = values(renderToStaticMarkup(await Dashboard()));
    expect(html).toMatch(/Published Projects 0 0 featured/);
    expect(html).toMatch(/Total Projects in Portfolio: 0/);
    expect(html).toMatch(/Published Featured Projects \(CMS\): 0/);
    expect(adminFetch).toHaveBeenCalledWith('/api/projects');
  });
  it('counts only exact published status and published featured records', async () => {
    adminFetch.mockImplementation(async (path: string) => Response.json(path === '/api/projects'
      ? ['published', 'draft', 'archived', undefined].map((status, index) => ({ ...INITIAL_PROJECTS[0], id: `record-${index}`, status, isFeatured: true })) : []));
    const html = values(renderToStaticMarkup(await Dashboard()));
    expect(html).toMatch(/Published Projects 1 1 featured/);
    expect(html).toMatch(/Total Projects in Portfolio: 4/);
  });
  it.each(['error', 'invalid', 'unauthenticated'])('shows unavailable rather than zero counts on %s', async scenario => {
    adminFetch.mockImplementation(async (path: string) => {
      if (path !== '/api/projects') return Response.json([]);
      if (scenario === 'unauthenticated') return null;
      if (scenario === 'invalid') return Response.json({ wrong: true });
      throw new Error('private internal detail');
    });
    const html = renderToStaticMarkup(await Dashboard());
    expect(html).toContain('role="alert"');
    expect(html).toContain('Unavailable');
    expect(html).not.toContain('private internal detail');
  });

  it('accepts valid records with optional fields omitted', async () => {
    const { fullStory, status, ...project } = INITIAL_PROJECTS[0];
    adminFetch.mockImplementation(async (path: string) => Response.json(path === '/api/projects' ? [project] : []));
    const html = values(renderToStaticMarkup(await Dashboard()));
    expect(html).toMatch(/Published Projects 0 0 featured/);
    expect(html).toMatch(/Total Projects in Portfolio: 1/);
    expect(html).not.toContain('Unavailable');
  });
  const malformed = [
    ['null entry', [null]], ['empty object', [{}]], ['wrong title', [{ ...INITIAL_PROJECTS[0], title: 123 }]],
    ['wrong boolean', [{ ...INITIAL_PROJECTS[0], isFeatured: 'true' }]],
    ['wrong gallery', [{ ...INITIAL_PROJECTS[0], gallery: 'image.jpg' }]],
    ['wrong gallery entry', [{ ...INITIAL_PROJECTS[0], gallery: [null] }]],
    ['wrong year', [{ ...INITIAL_PROJECTS[0], completionYear: '2024' }]],
    ['wrong story', [{ ...INITIAL_PROJECTS[0], fullStory: {} }]],
    ['wrong status', [{ ...INITIAL_PROJECTS[0], status: 123 }]],
    ['null status', [{ ...INITIAL_PROJECTS[0], status: null }]],
    ['non-array', { projects: [] }], ['mixed array', [INITIAL_PROJECTS[0], {}]],
  ] as const;
  it.each(malformed)('shows unavailable without crashing or partial counts for %s', async (_label, payload) => {
    adminFetch.mockImplementation(async (path: string) => Response.json(path === '/api/projects' ? payload : []));
    const html = renderToStaticMarkup(await Dashboard());
    expect(html).toContain('role="alert"');
    expect(html).toContain('Unavailable');
    expect(values(html)).not.toMatch(/Total Projects in Portfolio: [0-9]/);
    expect(values(html)).not.toMatch(/Published Projects [0-9]/);
  });
  it.each([401, 403, 500])('shows unavailable on HTTP %i without exposing the response', async status => {
    adminFetch.mockImplementation(async (path: string) => path === '/api/projects'
      ? Response.json({ error: 'private backend detail' }, { status }) : Response.json([]));
    const html = renderToStaticMarkup(await Dashboard());
    expect(html).toContain('role="alert"');
    expect(html).toContain('Unavailable');
    expect(html).not.toContain('private backend detail');
  });

  it('never returns production fallback reads or writes on API failure', async () => {
    for (const action of [
      () => getAllProjects(), () => getProjectById('proj-1'),
      () => getProjectBySlug('mns-university-of-agriculture-multan'),
      () => createProject({ title: 'Example' } as any),
      () => updateProject('proj-1', { title: 'Updated' }), () => deleteProject('proj-1'),
    ]) await expect(action()).rejects.toThrow();
  });
  it('uses the authenticated BFF and keeps legitimate detail misses', async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json({ id: 'persisted-project' }, { status: 201 }));
    expect(await createProject({ title: 'Example' } as any)).toEqual({ id: 'persisted-project' });
    expect(fetch).toHaveBeenCalledWith('/api/admin/backend/projects', expect.objectContaining({ method: 'POST', credentials: 'include' }));
    vi.mocked(fetch).mockResolvedValue(Response.json({}, { status: 404 }));
    expect(await getProjectBySlug('missing')).toBeNull();
    expect(await getProjectById('missing')).toBeNull();
  });
  it('keeps the CMS list on the authenticated no-store path with a separate error branch', () => {
    const source = readFileSync(new URL('../app/admin/projects/page.tsx', import.meta.url), 'utf8');
    expect(source).toContain("fetch(getAdminApiUrl('/api/projects')");
    expect(source).toContain("cache: 'no-store'");
    expect(source).toContain(') : listError ? (');
    expect(source).toContain('role="alert"');
  });
});
