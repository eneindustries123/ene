// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageConfigContext } from 'next/dist/shared/lib/image-config-context.shared-runtime';
import { imageConfigDefault, type ImageConfigComplete } from 'next/dist/shared/lib/image-config';
import { getImgProps } from 'next/dist/shared/lib/get-img-props';
import defaultLoader from 'next/dist/shared/lib/image-loader';
import { ImageOptimizerCache } from 'next/dist/server/image-optimizer';
import config from '../next.config.mjs';
import AdminProjectsPage from '../app/admin/projects/page';
import ProjectDetailPage from '../app/projects/[slug]/page';
import { getProjectBySlug } from '../lib/projects-store';
import { INITIAL_PROJECTS } from '../lib/data';

// Vitest has no RSC cache dispatcher. Image components/configuration remain real.
vi.mock('react', async (original) => ({ ...await original<typeof React>(), cache: (fn: unknown) => fn }));
vi.mock('../lib/projects-store', () => ({ getProjectBySlug: vi.fn() }));
vi.mock('../components/layout/Header', () => ({ Header: () => null }));
vi.mock('../components/layout/Footer', () => ({ Footer: () => null }));
vi.mock('next/link', () => ({ default: ({ children, prefetch, ...props }: any) => <a {...props}>{children}</a> }));

const images = { ...imageConfigDefault, ...config.images } as ImageConfigComplete;
const bucket = 'https://xnvxmolqsxizrfjysnnk.supabase.co/storage/v1/object/public/project-media';
const main = `${bucket}/p1-1.webp`;
const gallery = `${bucket}/uploads/1789397812050-p1-1.webp`;
const project = { ...INITIAL_PROJECTS[0], mainImage: main, gallery: [gallery] };
const withImageConfig = (child: React.ReactNode) => <ImageConfigContext.Provider value={images}>{child}</ImageConfigContext.Provider>;
const imageProps = (src: string) => getImgProps({ src, width: 800, height: 600 }, { defaultLoader, imgConf: images });

beforeEach(() => {
  // Next's development hostname check is deliberately skipped under NODE_ENV=test.
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json([project]));
  vi.mocked(getProjectBySlug).mockResolvedValue(project);
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('real Next.js image configuration for project Storage', () => {
  it.each([main, gallery])('accepts the ENE bucket URL in both development and production validation: %s', (src) => {
    expect(imageProps(src).props.src).toContain(encodeURIComponent(src));
    const validation = ImageOptimizerCache.validateParams({ headers: {} } as any,
      { url: src, w: '640', q: '75' }, { images } as any, false);
    expect(validation).not.toHaveProperty('errorMessage');
  });
  it.each([
    'https://another-project.supabase.co/storage/v1/object/public/project-media/test.webp',
    'https://xnvxmolqsxizrfjysnnk.supabase.co/storage/v1/object/public/another-bucket/test.webp',
    'https://xnvxmolqsxizrfjysnnk.supabase.co/storage/v1/object/sign/project-media/test.webp',
    'https://xnvxmolqsxizrfjysnnk.supabase.co/rest/v1/projects',
    'http://xnvxmolqsxizrfjysnnk.supabase.co/storage/v1/object/public/project-media/test.webp',
  ])('rejects unrelated hosts, paths and protocols: %s', (src) => {
    expect(() => imageProps(src)).toThrow();
    expect(ImageOptimizerCache.validateParams({ headers: {} } as any,
      { url: src, w: '640', q: '75' }, { images } as any, false)).toHaveProperty('errorMessage');
  });
  it.each(['https://images.unsplash.com/photo-test', 'https://cdn.sanity.io/images/kjz2jmxz/production/test.webp'])('preserves an existing allowed source: %s', (src) => {
    expect(() => imageProps(src)).not.toThrow();
  });

  it('renders real CMS card, edit preview and gallery images with Storage URLs', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      await act(async () => root.render(withImageConfig(<AdminProjectsPage />)));
      expect(container.querySelector(`img[src*="${encodeURIComponent(main)}"]`)).not.toBeNull();
      const edit = Array.from(container.querySelectorAll('button')).find((button) => button.textContent?.includes('Edit'))!;
      expect(edit).toBeDefined();
      await act(async () => edit.click());
      expect(container.querySelectorAll(`img[src*="${encodeURIComponent(main)}"]`).length).toBeGreaterThan(1);
      expect(container.querySelector(`img[src*="${encodeURIComponent(gallery)}"]`)).not.toBeNull();
    } finally {
      await act(async () => root.unmount());
      container.remove();
    }
  });
  it('renders the real detail main image and gallery with Storage URLs', async () => {
    const html = renderToStaticMarkup(withImageConfig(await ProjectDetailPage({ params: { slug: project.slug } })));
    expect(html).toContain(encodeURIComponent(main));
    expect(html).toContain(encodeURIComponent(gallery));
    expect(html).toContain('/_next/image');
  });
  it.each(['/images/projects/p1-1.jpg', 'data:image/png;base64,iVBORw0KGgo='])('preserves static and legacy data images in detail and gallery: %s', async (src) => {
    vi.mocked(getProjectBySlug).mockResolvedValue({ ...project, mainImage: src, gallery: [src] });
    const html = renderToStaticMarkup(withImageConfig(await ProjectDetailPage({ params: { slug: project.slug } })));
    expect(html).toContain(src.startsWith('data:') ? src : encodeURIComponent(src));
  });
});
