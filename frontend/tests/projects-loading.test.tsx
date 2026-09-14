import React, { Suspense } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ProjectsPage, { dynamic } from '../app/projects/page';
import ProjectsLoading from '../app/projects/loading';
import { getPublishedProjectDirectory } from '../lib/projects-store';
import { INITIAL_PROJECTS } from '../lib/data';
import { ProjectsDirectory } from '../components/projects/ProjectsDirectory';
import { getApiUrl } from '../lib/api-client';

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); vi.unstubAllEnvs(); });

function directoryBoundary(node: React.ReactNode): React.ReactElement<any> | undefined {
  if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return;
  if (node.type === Suspense) return node;
  for (const child of React.Children.toArray(node.props.children)) {
    const found = directoryBoundary(child);
    if (found) return found;
  }
}

describe('projects streaming and live directory loading', () => {
  it('renders an independent lazy image endpoint without the Vercel image proxy', async () => {
    const project = { ...INITIAL_PROJECTS[0], id: '11111111-1111-4111-8111-111111111111', status: 'published' };
    const imagePath = `/api/projects/${project.id}/image`;
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([{ ...project, mainImage: imagePath }]));
    const projects = await getPublishedProjectDirectory();
    expect(projects[0].mainImage).toBe(getApiUrl(imagePath));
    const html = renderToStaticMarkup(<ProjectsDirectory initialProjects={projects} />);
    expect(html).toContain(`src="${getApiUrl(imagePath)}"`);
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('aspect-[4/3]');
    expect(html).not.toContain('/_next/image');
    expect(html).not.toContain('data:image');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('returns the static shell synchronously without starting duplicate reads', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([]));
    const shell = ProjectsPage();
    expect(dynamic).toBe('force-dynamic');
    expect(fetchMock).not.toHaveBeenCalled();
    const boundary = directoryBoundary(shell)!;
    expect(boundary).toBeDefined();
    expect(renderToStaticMarkup(boundary.props.fallback)).toContain('Loading projects');
    const directory = await boundary.props.children.type();
    expect(renderToStaticMarkup(directory)).toContain('No projects found');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('status=published&view=directory'),
      expect.objectContaining({ cache: 'no-store', signal: expect.any(AbortSignal) }));
  });

  it('renders a lightweight accessible loading route without requests or media', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const html = renderToStaticMarkup(<ProjectsLoading />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Loading projects');
    expect(html).not.toMatch(/<img|<script|<iframe|<video/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps only explicitly published live cards', async () => {
    const base = INITIAL_PROJECTS[0];
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([
      { ...base, status: 'published' }, { ...base, status: 'draft' },
      { ...base, status: 'archived' }, { ...base, status: undefined },
    ]));
    expect(await getPublishedProjectDirectory()).toEqual([{ ...base, status: 'published' }]);
  });

  it.each([null, [null], [{}]])('rejects malformed live data without fixture fallback: %j', async (value) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(value));
    await expect(getPublishedProjectDirectory()).rejects.toThrow('temporarily unavailable');
  });

  it('shows a non-sensitive error instead of fixtures or a raw upstream error', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('private upstream details'));
    const boundary = directoryBoundary(ProjectsPage())!;
    const html = renderToStaticMarkup(await boundary.props.children.type());
    expect(html).toContain('role="alert"');
    expect(html).toContain('Projects are temporarily unavailable');
    expect(html).not.toContain('private upstream details');
    expect(html).not.toContain(INITIAL_PROJECTS[0].title);
  });

  it('keeps the deadline active after headers while the response body stalls', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => ({
      ok: true,
      json: () => new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new Error('body aborted')), { once: true });
      }),
    } as Response));
    const pending = expect(getPublishedProjectDirectory()).rejects.toThrow('body aborted');
    await vi.advanceTimersByTimeAsync(15000);
    await pending;
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
