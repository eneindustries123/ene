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

  it('selects three homepage projects using featured status and public ordering', () => {
    const projects = [
      { id: '1', slug: 'newest', isFeatured: false },
      { id: '2', slug: 'featured-newest', isFeatured: true },
      { id: '3', slug: 'featured-next', isFeatured: true },
      { id: '4', slug: 'older', isFeatured: false },
    ] as Awaited<ReturnType<typeof getPublishedProjects>>;

    expect(selectHomepageProjects(projects).map((project) => project.slug)).toEqual([
      'featured-newest',
      'featured-next',
      'newest',
    ]);
  });

  it('caches the homepage public-project request for five minutes', async () => {
    const projects = [{ id: 'cached-project', slug: 'cached-project' }];
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(projects)
    );

    await expect(fetchPublishedProjectsFromApi()).resolves.toEqual(projects);
    expect(PUBLIC_PROJECTS_REVALIDATE_SECONDS).toBe(300);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/projects?status=published'),
      expect.objectContaining({
        next: { revalidate: 300 },
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('keeps the homepage ISR-compatible without uncached dynamic rendering flags', () => {
    const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

    expect(source).not.toContain("dynamic = 'force-dynamic'");
    expect(source).not.toContain("cache: 'no-store'");
    expect(source).not.toContain('12_000');
    expect(source).toContain('fetchPublishedProjectsFromApi()');
    expect(source).toContain("preserveCachedHomepage = process.env.NODE_ENV === 'production' && !isProductionBuild()");
    expect(source).toContain('Published projects unavailable during homepage regeneration.');
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
