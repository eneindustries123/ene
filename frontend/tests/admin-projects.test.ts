import { readFileSync } from 'node:fs';
import { afterEach, describe, it, expect, vi } from 'vitest';
import {
  getAllProjects,
  getPublishedProjects,
  getProjectBySlug,
  fetchPublishedProjectsFromApi,
  createProject,
  updateProject,
  deleteProject,
  isSlugUnique,
  PUBLIC_PROJECTS_REVALIDATE_SECONDS,
  selectHomepageProjects,
} from '../lib/projects-store';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Admin Projects Store & CRUD Unit Tests', () => {
  it('loads all existing projects', async () => {
    const projects = await getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty('title');
    expect(projects[0]).toHaveProperty('slug');
    expect(projects[0]).toHaveProperty('mainImage');
  });

  it('filters published projects for public display', async () => {
    const published = await getPublishedProjects();
    expect(published.length).toBeGreaterThan(0);
    published.forEach((p) => {
      expect(p.status === 'published' || p.status === undefined).toBe(true);
    });
  });

  it('selects ONLY published and featured projects (max 3) without substituting non-featured projects', () => {
    const mixedProjects = [
      { id: '1', slug: 'featured-1', isFeatured: true, status: 'published' },
      { id: '2', slug: 'regular-1', isFeatured: false, status: 'published' },
      { id: '3', slug: 'featured-2', isFeatured: true, status: 'published' },
      { id: '4', slug: 'draft-featured', isFeatured: true, status: 'draft' },
      { id: '5', slug: 'archived-featured', isFeatured: true, status: 'archived' },
      { id: '6', slug: 'featured-3', isFeatured: true, status: 'published' },
      { id: '7', slug: 'featured-4', isFeatured: true, status: 'published' },
    ] as any;

    const selected = selectHomepageProjects(mixedProjects);
    expect(selected.map((p) => p.slug)).toEqual(['featured-1', 'featured-2', 'featured-3']);
    expect(selected.length).toBe(3);
  });

  it('returns exactly the qualifying count if fewer than 3 featured projects exist', () => {
    const twoFeatured = [
      { id: '1', slug: 'feat-1', isFeatured: true, status: 'published' },
      { id: '2', slug: 'regular-1', isFeatured: false, status: 'published' },
      { id: '3', slug: 'feat-2', isFeatured: true, status: 'published' },
    ] as any;

    expect(selectHomepageProjects(twoFeatured).map((p) => p.slug)).toEqual(['feat-1', 'feat-2']);

    const zeroFeatured = [
      { id: '1', slug: 'regular-1', isFeatured: false, status: 'published' },
      { id: '2', slug: 'regular-2', isFeatured: false, status: 'published' },
    ] as any;

    expect(selectHomepageProjects(zeroFeatured)).toEqual([]);
  });

  it('defines exactly the 3 static homepage showcase projects with valid detail hrefs and images', async () => {
    const { HOMEPAGE_FEATURED_PROJECTS } = await import('../lib/data');

    expect(HOMEPAGE_FEATURED_PROJECTS).toHaveLength(3);

    expect(HOMEPAGE_FEATURED_PROJECTS[0]).toEqual({
      title: 'MNS University of Agriculture Multan',
      image: '/images/projects/p1-1.jpg',
      href: '/projects/mns-university-of-agriculture-multan',
    });

    expect(HOMEPAGE_FEATURED_PROJECTS[1]).toEqual({
      title: 'Chakdara Swat Site',
      image: '/images/projects/p2-1.jpg',
      href: '/projects/chakdara-swat-25kw',
    });

    expect(HOMEPAGE_FEATURED_PROJECTS[2]).toEqual({
      title: 'Punjab Pharmacy Commercial Complex',
      image: '/images/projects/p3-1.jpg',
      href: '/projects/punjab-pharmacy',
    });

    // Verify detail routes correspond to real published projects in data
    const published = await getPublishedProjects();
    const publishedSlugs = published.map((p) => p.slug);

    HOMEPAGE_FEATURED_PROJECTS.forEach((item) => {
      const slug = item.href.replace('/projects/', '');
      expect(publishedSlugs).toContain(slug);
    });
  });

  it('keeps homepage completely free of runtime project API calls, timeouts, and failure states', () => {
    const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
    const featuredComponent = readFileSync(
      new URL('../components/sections/FeaturedProjects.tsx', import.meta.url),
      'utf8'
    );

    // No dynamic flags
    expect(source).not.toContain("dynamic = 'force-dynamic'");
    expect(source).not.toContain("cache: 'no-store'");
    expect(source).not.toContain('revalidate: 0');
    expect(source).not.toContain('fetchFeaturedProjectsFromApi');
    expect(source).not.toContain('fetchPublishedProjectsFromApi');
    expect(source).not.toContain('loadFailed');

    // Failure message completely removed from homepage
    expect(featuredComponent).not.toContain('Current projects are temporarily unavailable.');
    expect(featuredComponent).not.toContain('No published projects are available yet.');
    expect(featuredComponent).toContain('HOMEPAGE_FEATURED_PROJECTS');
  });

  it('caches the API featured-projects request for admin/standalone callers with tag and 300s TTL', async () => {
    const {
      fetchFeaturedProjectsFromApi,
      FEATURED_PROJECTS_CACHE_TAG,
      FEATURED_PROJECTS_REVALIDATE_SECONDS,
    } = await import('../lib/projects-store');

    const featuredMock = [{ id: 'feat-1', slug: 'feat-1', isFeatured: true, status: 'published' }];
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(featuredMock)
    );

    await expect(fetchFeaturedProjectsFromApi()).resolves.toEqual(featuredMock);
    expect(FEATURED_PROJECTS_CACHE_TAG).toBe('featured-projects');
    expect(FEATURED_PROJECTS_REVALIDATE_SECONDS).toBe(300);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/projects?status=published&featured=true&limit=3'),
      expect.objectContaining({
        next: {
          revalidate: 300,
          tags: ['featured-projects'],
        },
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('verifies admin BFF includes on-demand cache revalidation for project mutations', () => {
    const bffSource = readFileSync(
      new URL('../app/api/admin/backend/[...path]/route.ts', import.meta.url),
      'utf8'
    );

    expect(bffSource).toContain("import {");
    expect(bffSource).toContain('FEATURED_PROJECTS_CACHE_TAG');
    expect(bffSource).toContain('PUBLIC_PROJECTS_CACHE_TAG');
    expect(bffSource).toContain('backendResponse.ok');
    expect(bffSource).toContain("path[0] === 'projects'");
    expect(bffSource).toContain('revalidateTag(FEATURED_PROJECTS_CACHE_TAG)');
    expect(bffSource).toContain('revalidateTag(PUBLIC_PROJECTS_CACHE_TAG)');
    expect(bffSource).toContain("revalidatePath('/')");
    expect(bffSource).toContain("revalidatePath('/projects')");
    expect(bffSource).toContain("revalidatePath('/projects/[slug]', 'page')");
  });

  it('renders all published projects without an arbitrary 6-project limit', async () => {
    const published = await getPublishedProjects();
    // Must contain all 8 published projects in seed / API
    expect(published.length).toBeGreaterThanOrEqual(8);

    const titles = published.map((p) => p.title);
    expect(titles).toContain('Ayyub Hockey Stadium 200 kW Solar Parking Lot');
    expect(titles).toContain('Kashf Foundation Regional Offices Solarization  Slug');
    expect(titles).toContain('MNS University of Agriculture Multan');
    expect(titles).toContain('Chakdara Swat Site');
    expect(titles).toContain('Punjab Pharmacy Commercial Complex');
    expect(titles).toContain('Chitral Remote Site Deployment');
    expect(titles).toContain('Punjab Group of Pharmacies Central Hub');
    expect(titles).toContain('Bareeze DHA Elevated Shed Structure');

    // No duplicate slugs
    const slugs = published.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);

    // Draft & Archived projects are excluded
    published.forEach((p) => {
      expect(p.status).toBe('published');
    });
  });

  it('re-throws on API failure in production runtime so Next.js ISR preserves previously cached page without stale seed fallback', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalNextPhase = process.env.NEXT_PHASE;

    try {
      (process.env as any).NODE_ENV = 'production';
      delete (process.env as any).NEXT_PHASE;

      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network timeout / 500 error'));

      await expect(getPublishedProjects()).rejects.toThrow(
        /Network timeout \/ 500 error|Published projects unavailable/
      );
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalNextPhase !== undefined) {
        (process.env as any).NEXT_PHASE = originalNextPhase;
      } else {
        delete (process.env as any).NEXT_PHASE;
      }
    }
  });

  it('re-throws on project detail API failure in production runtime so Next.js ISR preserves previously cached detail page', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalNextPhase = process.env.NEXT_PHASE;

    try {
      (process.env as any).NODE_ENV = 'production';
      delete (process.env as any).NEXT_PHASE;

      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Upstream timeout'));

      await expect(getProjectBySlug('mns-university-of-agriculture-multan')).rejects.toThrow(
        /Upstream timeout|unavailable during production ISR regeneration/
      );
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalNextPhase !== undefined) {
        (process.env as any).NEXT_PHASE = originalNextPhase;
      } else {
        delete (process.env as any).NEXT_PHASE;
      }
    }
  });

  it('creates a new project and validates slug uniqueness', async () => {
    const newSlug = `test-solar-project-${Date.now()}`;
    expect(await isSlugUnique(newSlug)).toBe(true);

    const created = await createProject({
      title: 'Test Solar Project',
      slug: newSlug,
      client: 'Test Client',
      location: 'Lahore, Pakistan',
      capacity: '100KW',
      category: 'Commercial Solar',
      completionYear: 2025,
      summary: 'A test project for unit testing verification.',
      fullStory: 'Detailed engineering scope description for testing.',
      mainImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276',
      gallery: [],
      isFeatured: true,
      status: 'published',
    });

    expect(created.id).toBeDefined();
    expect(created.slug).toBe(newSlug);

    const fetched = await getProjectBySlug(newSlug);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('Test Solar Project');

    // Clean up
    await deleteProject(created.id);
  });

  it('updates an existing project', async () => {
    const projects = await getAllProjects();
    const target = projects[0];

    const updated = await updateProject(target.id, {
      capacity: 'Updated 200KW',
    });

    expect(updated?.capacity).toBe('Updated 200KW');
  });
});
