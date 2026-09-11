import { Project, INITIAL_PROJECTS } from './data';
import { apiFetchWithTimeout, getApiUrl, isProductionBuild } from './api-client';

let inMemoryProjects: Project[] = INITIAL_PROJECTS.map((p) => ({
  ...p,
  status: p.status || 'published',
}));

export type { Project };

type ProjectFetchOptions = RequestInit & {
  next?: { revalidate?: number };
};

export const FEATURED_PROJECTS_CACHE_TAG = 'featured-projects';
export const PUBLIC_PROJECTS_CACHE_TAG = 'published-projects';
export const FEATURED_PROJECTS_REVALIDATE_SECONDS = 300;
export const PUBLIC_PROJECTS_REVALIDATE_SECONDS = 0;
const PUBLIC_PROJECTS_FETCH_TIMEOUT_MS = 15_000;
const FEATURED_PROJECTS_FETCH_TIMEOUT_MS = 15_000;

/**
 * Fetches the backend's published and featured projects with Next.js ISR caching.
 * Exclusively consumed by the homepage Featured Projects showcase.
 */
export async function fetchFeaturedProjectsFromApi(
  options: ProjectFetchOptions = {
    next: {
      revalidate: FEATURED_PROJECTS_REVALIDATE_SECONDS,
      tags: [FEATURED_PROJECTS_CACHE_TAG],
    },
  },
  timeoutMs = FEATURED_PROJECTS_FETCH_TIMEOUT_MS
): Promise<Project[]> {
  const res = await apiFetchWithTimeout(
    getApiUrl('/api/projects?status=published&featured=true&limit=3'),
    options,
    timeoutMs
  );

  if (!res.ok) {
    throw new Error('Featured projects are temporarily unavailable.');
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('The featured projects response is invalid.');
  }

  return data;
}

/**
 * Fetches the backend's ordered public project list dynamically without caching or seed fallback.
 * Guarantees fresh real-time retrieval on every request.
 */
export async function fetchPublishedProjectsFromApi(
  options: ProjectFetchOptions = {
    cache: 'no-store',
  },
  timeoutMs = PUBLIC_PROJECTS_FETCH_TIMEOUT_MS
): Promise<Project[]> {
  const res = await apiFetchWithTimeout(
    getApiUrl('/api/projects?status=published'),
    options,
    timeoutMs
  );

  if (!res.ok) {
    throw new Error('Published projects are temporarily unavailable.');
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('The published projects response is invalid.');
  }

  return data;
}

/**
 * Strictly filters for Published + Featured projects up to the specified limit (max 3).
 * Does NOT substitute non-featured projects into unfilled slots.
 */
export function selectHomepageProjects(projects: Project[], limit = 3): Project[] {
  const featured = projects.filter(
    (project) => Boolean(project.isFeatured) && project.status === 'published'
  );
  return featured.slice(0, limit);
}

/**
 * Retrieves all projects from standalone backend API (or fallback).
 */
export async function getAllProjects(): Promise<Project[]> {
  if (isProductionBuild()) return [...inMemoryProjects];

  try {
    const res = await apiFetchWithTimeout(getApiUrl('/api/projects'), {
      cache: 'no-store',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Local development fallback
  }

  return [...inMemoryProjects];
}

/**
 * Retrieves only published projects dynamically for public display.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const data = await fetchPublishedProjectsFromApi({
      cache: 'no-store',
    });
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    const isProdRuntime = process.env.NODE_ENV === 'production' && !isProductionBuild();
    if (isProdRuntime) {
      console.warn(
        '[projects-store] Published projects API request failed during production runtime; re-throwing to prevent stale seed fallback:',
        err
      );
      throw err instanceof Error
        ? err
        : new Error('Published projects unavailable during production runtime.');
    }

    console.warn(
      '[projects-store] Published projects API request unavailable; using local development/build fallback seed:',
      err
    );
  }

  return inMemoryProjects.filter((p) => p.status === 'published');
}


/**
 * Retrieves a single project dynamically by URL slug.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await apiFetchWithTimeout(
      getApiUrl(`/api/projects/${slug}`),
      {
        cache: 'no-store',
      },
      PUBLIC_PROJECTS_FETCH_TIMEOUT_MS
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.slug) {
        return data;
      }
    }
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      const isProdRuntime = process.env.NODE_ENV === 'production' && !isProductionBuild();
      if (isProdRuntime) {
        throw new Error(`Project detail API request failed with status ${res.status}`);
      }
    }
  } catch (err) {
    const isProdRuntime = process.env.NODE_ENV === 'production' && !isProductionBuild();
    if (isProdRuntime) {
      console.warn(
        `[projects-store] Project detail API request for "${slug}" failed during production runtime; re-throwing:`,
        err
      );
      throw err instanceof Error
        ? err
        : new Error(`Project "${slug}" unavailable during production runtime.`);
    }
  }

  const found = inMemoryProjects.find((p) => p.slug === slug);
  return found || null;
}

/**
 * Retrieves a single project by ID.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const res = await apiFetchWithTimeout(
      getApiUrl(`/api/projects/${id}`),
      {
        cache: 'no-store',
        credentials: 'include',
      },
      PUBLIC_PROJECTS_FETCH_TIMEOUT_MS
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return data;
      }
    }
  } catch {
    // Local fallback
  }

  const found = inMemoryProjects.find((p) => p.id === id);
  return found || null;
}

/**
 * Creates a new project via Backend API.
 */
export async function createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
  try {
    const res = await apiFetchWithTimeout(getApiUrl('/api/projects'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(projectData),
    });

    if (res.ok) {
      const created = await res.json();
      inMemoryProjects = [created, ...inMemoryProjects.filter((p) => p.id !== created.id)];
      return created;
    }
  } catch {
    // Fallback
  }

  const fallbackId = `proj-${Date.now()}`;
  const fallbackProject: Project = {
    ...projectData,
    id: fallbackId,
    status: projectData.status || 'published',
  };

  inMemoryProjects = [fallbackProject, ...inMemoryProjects.filter((p) => p.id !== fallbackProject.id)];
  return fallbackProject;
}

/**
 * Updates an existing project via Backend API.
 */
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  try {
    const res = await apiFetchWithTimeout(getApiUrl(`/api/projects/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const updated = await res.json();
      const memIdx = inMemoryProjects.findIndex((p) => p.id === id);
      if (memIdx !== -1) inMemoryProjects[memIdx] = updated;
      else inMemoryProjects.push(updated);
      return updated;
    }
  } catch {
    // Fallback
  }

  const currentIdx = inMemoryProjects.findIndex((p) => p.id === id);
  if (currentIdx !== -1) {
    inMemoryProjects[currentIdx] = { ...inMemoryProjects[currentIdx], ...updates };
    return inMemoryProjects[currentIdx];
  }
  return null;
}

/**
 * Permanently deletes a project via Backend API.
 */
export async function deleteProject(id: string): Promise<boolean> {
  try {
    const res = await apiFetchWithTimeout(getApiUrl(`/api/projects/${id}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
      return true;
    }
  } catch {
    // Fallback
  }

  inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
  return true;
}

/**
 * Checks slug uniqueness.
 */
export async function isSlugUnique(slug: string, currentId?: string): Promise<boolean> {
  return !inMemoryProjects.some((p) => p.slug === slug && p.id !== currentId);
}
