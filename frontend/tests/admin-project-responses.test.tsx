// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminProjectsPage from '../app/admin/projects/page';
import { INITIAL_PROJECTS } from '../lib/data';

vi.mock('next/image', () => ({
  default: ({ fill, priority, quality, sizes, ...props }: any) => <img {...props} />,
}));
vi.mock('next/link', () => ({
  default: ({ prefetch, children, ...props }: any) => <a {...props}>{children}</a>,
}));

let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No live requests allowed'));
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function renderResponse(payload: unknown, status = 200) {
  vi.mocked(fetch).mockResolvedValue(Response.json(payload, { status }));
  await act(async () => root.render(<AdminProjectsPage />));
}
function expectListError() {
  expect(container.querySelector('[role="alert"]')?.textContent).toBe('Unable to load projects. Please refresh to try again.');
  expect(container.textContent).not.toContain('No projects found');
  expect(container.querySelector('[title="View Public Page"]')).toBeNull();
}

describe('admin project list response handling', () => {
  it('cannot persist a temporary preview after a failed main-image upload', async () => {
    const NativeURL = URL;
    vi.stubGlobal('URL', class extends NativeURL {
      static createObjectURL() { return 'blob:temporary-main-image'; }
      static revokeObjectURL() {}
    });
    await renderResponse([]);
    await act(async () => {
      const button = Array.from(container.querySelectorAll('button')).find((item) => item.textContent?.includes('Create New Project'))!;
      button.click();
    });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    Object.defineProperty(input, 'files', { value: [new File(['image'], 'main.png', { type: 'image/png' })] });
    vi.mocked(fetch).mockResolvedValue(Response.json({ error: 'Media storage is unavailable.' }, { status: 500 }));
    await act(async () => input.dispatchEvent(new Event('change', { bubbles: true })));
    expect(container.querySelector('img[src="blob:temporary-main-image"]')).toBeNull();
    const callsBeforeSave = vi.mocked(fetch).mock.calls.length;
    await act(async () => container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(container.textContent).toContain('Please upload a main project image');
    expect(fetch).toHaveBeenCalledTimes(callsBeforeSave);
  });
  it('renders the legitimate empty state for []', async () => {
    await renderResponse([]);
    expect(container.textContent).toContain('No projects found');
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(fetch).toHaveBeenCalledWith('/api/admin/backend/projects', expect.objectContaining({ cache: 'no-store', credentials: 'include' }));
  });
  it('renders valid projects and their public navigation anchors', async () => {
    await renderResponse([INITIAL_PROJECTS[0]]);
    expect(container.textContent).toContain(INITIAL_PROJECTS[0].title);
    expect(container.querySelector('[title="View Public Page"]')?.getAttribute('href')).toBe(`/projects/${INITIAL_PROJECTS[0].slug}`);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });
  it('accepts omitted optional fields and an empty gallery', async () => {
    const { fullStory, status, ...project } = INITIAL_PROJECTS[0];
    await renderResponse([{ ...project, gallery: [] }]);
    expect(container.textContent).toContain(project.title);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });
  const malformed = [
    ['null entry', [null]], ['empty object', [{}]], ['non-array', { projects: [] }],
    ['wrong boolean', [{ ...INITIAL_PROJECTS[0], isFeatured: 'true' }]],
    ['wrong gallery', [{ ...INITIAL_PROJECTS[0], gallery: {} }]],
    ['wrong gallery item', [{ ...INITIAL_PROJECTS[0], gallery: [null] }]],
    ['wrong year', [{ ...INITIAL_PROJECTS[0], completionYear: '2024' }]],
    ['fractional year', [{ ...INITIAL_PROJECTS[0], completionYear: 2024.5 }]],
    ['wrong story', [{ ...INITIAL_PROJECTS[0], fullStory: {} }]],
    ['wrong status', [{ ...INITIAL_PROJECTS[0], status: 123 }]],
    ['unknown status', [{ ...INITIAL_PROJECTS[0], status: 'pending' }]],
    ['null status', [{ ...INITIAL_PROJECTS[0], status: null }]],
    ['mixed array', [INITIAL_PROJECTS[0], {}]],
  ] as const;
  it.each(malformed)('renders an error without crashing or filtering records for %s', async (_label, payload) => {
    await renderResponse(payload);
    expectListError();
  });
  it.each(['id', 'title', 'slug', 'client', 'location', 'capacity', 'category', 'summary', 'mainImage'])('rejects an incorrect %s string field', async field => {
    await renderResponse([{ ...INITIAL_PROJECTS[0], [field]: 123 }]);
    expectListError();
  });
  it.each(['id', 'title', 'slug', 'client', 'location', 'capacity', 'category', 'summary', 'mainImage', 'completionYear', 'gallery', 'isFeatured'])('rejects a missing required %s field', async field => {
    const project: Record<string, unknown> = { ...INITIAL_PROJECTS[0] };
    delete project[field];
    await renderResponse([project]);
    expectListError();
  });
  it.each([401, 403, 500])('renders an error for HTTP %i without exposing backend details', async status => {
    await renderResponse({ error: 'private backend detail' }, status);
    expectListError();
    expect(container.textContent).not.toContain('private backend detail');
  });
  it('renders an error on network failure', async () => {
    await act(async () => root.render(<AdminProjectsPage />));
    expectListError();
  });
  it('renders an error for invalid JSON', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('invalid JSON', { status: 200 }));
    await act(async () => root.render(<AdminProjectsPage />));
    expectListError();
  });
  it('rejects a mixed response after a successful load rather than showing partial records', async () => {
    await renderResponse([INITIAL_PROJECTS[0]]);
    vi.mocked(fetch).mockResolvedValue(Response.json([INITIAL_PROJECTS[0], null]));
    await act(async () => {
      (container.querySelector('[title="Refresh List"]') as HTMLButtonElement).click();
    });
    expectListError();
  });
});
