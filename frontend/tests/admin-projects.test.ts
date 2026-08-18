import { describe, it, expect } from 'vitest';
import {
  getAllProjects,
  getPublishedProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  isSlugUnique,
} from '../lib/projects-store';

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
