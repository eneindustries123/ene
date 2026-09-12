import React from 'react';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Hero } from '../components/sections/Hero';
import { CoreExpertise } from '../components/sections/CoreExpertise';
import { TechnologySpotlight } from '../components/sections/TechnologySpotlight';
import { FeaturedProjects } from '../components/sections/FeaturedProjects';
import { GetInTouchForm } from '../components/sections/GetInTouchForm';
import { ProjectsDirectory } from '../components/projects/ProjectsDirectory';
import { BlogCard } from '../components/blog/BlogCard';
import { HOMEPAGE_FEATURED_PROJECTS, INITIAL_PROJECTS } from '../lib/data';

const { links } = vi.hoisted(() => ({ links: [] as Array<{ href: string; prefetch?: boolean }> }));

// Capture application props at the Next.js boundary while retaining real anchor HTML.
vi.mock('next/link', () => ({
  default: ({ href, prefetch, children, ...props }: any) => {
    links.push({ href, prefetch });
    return <a href={href} {...props}>{children}</a>;
  },
}));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('../app/actions/contact', () => ({ submitContactForm: vi.fn() }));
vi.mock('../components/blog/SanityImage', () => ({ SanityImage: () => null }));

beforeEach(() => { links.length = 0; });

function assertLinks(element: React.ReactElement, expected: string[]) {
  const html = renderToStaticMarkup(element);
  expect(links.map((link) => link.href)).toEqual(expected);
  expect(links.every((link) => link.prefetch === false)).toBe(true);
  for (const href of expected) expect(html).toContain(`href="${href}"`);
  // Disabling prefetch must not become a disabled HTML control.
  expect(html).not.toMatch(/<a\b[^>]*(?:aria-disabled="true"|tabindex="-1"|\sdisabled)/);
  return html;
}

const headerHrefs = ['/', '/', '/about', '/projects', '/blogs', '/contact', '/request-a-quote'];
const footerHrefs = [
  '/', '/request-a-quote', '/contact', '/solar-energy', '/trading-contracting',
  '/fabrication-design', '/projects', '/about', '/company-profile', '/projects',
  '/blogs', '/contact', '/request-a-quote', '/privacy-policy', '/terms-and-conditions',
];
const projectHrefs = [
  '/projects/mns-university-of-agriculture-multan',
  '/projects/chakdara-swat-25kw',
  '/projects/punjab-pharmacy',
];

describe('public navigation without speculative route requests', () => {
  it('preserves header anchor destinations and keyboard/menu controls', () => {
    const html = assertLinks(<Header />, headerHrefs);
    expect(html).toContain('aria-label="Open mobile navigation menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="mobile-navigation-drawer"');
  });

  it('preserves all footer anchors, including repeated destinations and legal links', () => {
    assertLinks(<Footer />, footerHrefs);
  });

  it('disables speculative homepage navigation for the symbol logo variant too', () => {
    assertLinks(<BrandLogo variant="symbol" />, ['/']);
  });

  it('preserves fragment hrefs and their existing navigation implementation', () => {
    assertLinks(<Hero />, ['#services', '#mission-vision']);
  });

  it('keeps the fixed three-project showcase and its clickable detail links', () => {
    expect(HOMEPAGE_FEATURED_PROJECTS.map((project) => project.href)).toEqual(projectHrefs);
    assertLinks(<FeaturedProjects />, ['/projects', ...projectHrefs]);
  });

  it('disables every project card without changing the slug destination', () => {
    assertLinks(<ProjectsDirectory initialProjects={INITIAL_PROJECTS} />,
      INITIAL_PROJECTS.map((project) => `/projects/${project.slug}`));
  });

  it('keeps a blog card as a descriptive article anchor without prefetch', () => {
    const html = assertLinks(<BlogCard post={{
      _id: 'test-post', slug: 'solar-planning', title: 'Solar planning',
      excerpt: 'An engineering guide.', publishedAt: '2026-09-01T00:00:00Z',
      readingText: 'Plan your solar installation.',
    } as any} />, ['/blogs/solar-planning']);
    expect(html).toContain('aria-label="Read article: Solar planning"');
  });

  it('preserves the four core service destinations', () => {
    assertLinks(<CoreExpertise />, [
      '/solar-energy', '/trading-contracting', '/fabrication-design', '/solar-bill-analyzer',
    ]);
  });

  it('disables repeated technology and contact conversion links', () => {
    assertLinks(<><TechnologySpotlight /><GetInTouchForm /></>, [
      '/solar-energy', '/request-a-quote', '/solar-energy', '/request-a-quote',
    ]);
  });

  it('leaves zero prefetch-enabled links across all 36 homepage link instances', () => {
    assertLinks(<><Header /><Hero /><CoreExpertise /><TechnologySpotlight />
      <FeaturedProjects /><GetInTouchForm /><Footer /></>, [
      ...headerHrefs, '#services', '#mission-vision',
      '/solar-energy', '/trading-contracting', '/fabrication-design', '/solar-bill-analyzer',
      '/solar-energy', '/request-a-quote', '/solar-energy',
      '/projects', ...projectHrefs, '/request-a-quote', ...footerHrefs,
    ]);
    expect(links).toHaveLength(36);
  });
});

describe('conditional navigation and request-scoped loader contracts', () => {
  it('also disables links in unopened desktop/mobile service menus and product cards', () => {
    for (const file of ['components/layout/Header.tsx', 'app/products/page.tsx']) {
      const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
      const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      let count = 0;
      function visit(node: ts.Node) {
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(tree) === 'Link') {
          count++;
          const prop = node.attributes.properties.find((attr) => ts.isJsxAttribute(attr) && attr.name.getText(tree) === 'prefetch');
          expect(prop?.getText(tree)).toBe('prefetch={false}');
        }
        ts.forEachChild(node, visit);
      }
      visit(tree);
      expect(count).toBe(file.includes('Header') ? 13 : 1);
    }
  });

  it('shares one React cache loader between metadata and page, without persistent caching', () => {
    // React request cache requires an RSC dispatcher, absent in Vitest's Node renderer.
    // Verify the wiring here; the production build validates the server integration.
    const source = readFileSync(new URL('../app/projects/[slug]/page.tsx', import.meta.url), 'utf8');
    expect(source).toContain("import React, { cache } from 'react'");
    expect(source).toContain('const getProject = cache((slug: string) => getProjectBySlug(slug));');
    expect(source.match(/await getProject\(params.slug\)/g)).toHaveLength(2);
    expect(source.match(/getProjectBySlug\(slug\)/g)).toHaveLength(1);
    expect(source).toContain("export const dynamic = 'force-dynamic'");
    expect(source).not.toMatch(/unstable_cache|force-cache|export const revalidate/);
  });
});
