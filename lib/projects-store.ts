import { Project, INITIAL_PROJECTS } from './data';
import { createServerSupabaseClient } from './supabase/server';

// In-memory fallback store initialized with INITIAL_PROJECTS
let inMemoryProjects: Project[] = INITIAL_PROJECTS.map((p) => ({
  ...p,
  status: p.status || 'published',
}));

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        client: row.client,
        location: row.location,
        capacity: row.capacity,
        category: row.category,
        completionYear: row.completion_year,
        summary: row.summary,
        fullStory: row.full_story,
        mainImage: row.main_image,
        gallery: row.gallery || [],
        isFeatured: row.is_featured,
        status: row.status || 'published',
      }));
    }
  } catch {
    // Fall back to in-memory store
  }

  return [...inMemoryProjects];
}

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.status === 'published' || p.status === undefined);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  const found = all.find((p) => p.slug === slug);
  return found || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const all = await getAllProjects();
  const found = all.find((p) => p.id === id);
  return found || null;
}

export async function createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
  const newId = `proj-${Date.now()}`;
  const newProject: Project = {
    ...projectData,
    id: newId,
    status: projectData.status || 'published',
  };

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: newProject.title,
        slug: newProject.slug,
        client: newProject.client,
        location: newProject.location,
        capacity: newProject.capacity,
        category: newProject.category,
        completion_year: newProject.completionYear,
        summary: newProject.summary,
        full_story: newProject.fullStory,
        main_image: newProject.mainImage,
        gallery: newProject.gallery,
        is_featured: newProject.isFeatured,
        status: newProject.status,
      })
      .select()
      .single();

    if (!error && data) {
      newProject.id = data.id;
    }
  } catch {
    // Supabase insert fallback to in-memory
  }

  // Prepend to in-memory store
  inMemoryProjects = [newProject, ...inMemoryProjects.filter((p) => p.id !== newProject.id)];
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const existingIndex = inMemoryProjects.findIndex((p) => p.id === id);
  if (existingIndex === -1 && !(await getProjectById(id))) return null;

  const current = inMemoryProjects[existingIndex] || (await getProjectById(id));
  if (!current) return null;

  const updatedProject: Project = {
    ...current,
    ...updates,
  };

  try {
    const supabase = createServerSupabaseClient();
    await supabase
      .from('projects')
      .update({
        title: updatedProject.title,
        slug: updatedProject.slug,
        client: updatedProject.client,
        location: updatedProject.location,
        capacity: updatedProject.capacity,
        category: updatedProject.category,
        completion_year: updatedProject.completionYear,
        summary: updatedProject.summary,
        full_story: updatedProject.fullStory,
        main_image: updatedProject.mainImage,
        gallery: updatedProject.gallery,
        is_featured: updatedProject.isFeatured,
        status: updatedProject.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
  } catch {
    // Fall back to in-memory
  }

  if (existingIndex !== -1) {
    inMemoryProjects[existingIndex] = updatedProject;
  } else {
    inMemoryProjects.push(updatedProject);
  }

  return updatedProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient();
    await supabase.from('projects').delete().eq('id', id);
  } catch {
    // Fall back to in-memory
  }

  inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
  return true;
}

export function isSlugUnique(slug: string, currentId?: string): boolean {
  return !inMemoryProjects.some((p) => p.slug === slug && p.id !== currentId);
}
