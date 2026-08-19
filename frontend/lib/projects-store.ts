import { Project, INITIAL_PROJECTS } from './data';
import { apiFetchWithTimeout, getApiUrl, isProductionBuild } from './api-client';

let inMemoryProjects: Project[] = INITIAL_PROJECTS.map((p) => ({
  ...p,
  status: p.status || 'published',
}));

export type { Project };

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
 * Retrieves only published projects for public display.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  if (isProductionBuild()) {
    return inMemoryProjects.filter((p) => p.status === 'published' || p.status === undefined);
  }

  try {
    const res = await apiFetchWithTimeout(getApiUrl('/api/projects?status=published'), {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Local fallback
  }

  return inMemoryProjects.filter((p) => p.status === 'published' || p.status === undefined);
}

/**
 * Retrieves a single project by URL slug.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isProductionBuild()) {
    return inMemoryProjects.find((p) => p.slug === slug) || null;
  }

  try {
    const res = await apiFetchWithTimeout(getApiUrl(`/api/projects/${slug}`), {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.slug) {
        return data;
      }
    }
  } catch {
    // Local fallback
  }

  const found = inMemoryProjects.find((p) => p.slug === slug);
  return found || null;
}

/**
 * Retrieves a single project by ID.
 */
export async function getProjectById(id: string): Promise<Project | null> {
  if (isProductionBuild()) {
    return inMemoryProjects.find((p) => p.id === id) || null;
  }

  try {
    const res = await apiFetchWithTimeout(getApiUrl(`/api/projects/${id}`), {
      cache: 'no-store',
      credentials: 'include',
    });
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
