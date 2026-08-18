import { getSupabaseAdminClient, isSupabaseConfigured } from '../lib/supabase/admin';
import { getSupabaseAnonClient } from '../lib/supabase/client';

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  location: string;
  capacity: string;
  category: string;
  completionYear: string;
  summary: string;
  fullStory: string;
  mainImage: string;
  gallery: string[];
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}

// In-memory fallback store
let inMemoryProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'MNS University of Agriculture Multan',
    slug: 'mns-university-of-agriculture-multan',
    client: 'MNS University of Agriculture',
    location: 'Multan, Punjab, Pakistan',
    capacity: '1.2 MW',
    category: 'Commercial Solar',
    completionYear: '2023',
    summary: 'Turnkey rooftop and ground-mount photovoltaic deployment powering educational and research facilities.',
    fullStory: 'Comprehensive engineering, procurement, and construction (EPC) of a 1.2MW grid-tied solar system at MNS University of Agriculture Multan.',
    mainImage: '/images/project-agriculture.jpg',
    gallery: ['/images/project-agriculture.jpg'],
    isFeatured: true,
    status: 'published',
  },
  {
    id: 'proj-2',
    title: 'Chakdara Swat 25KW System',
    slug: 'chakdara-swat-25kw',
    client: 'Private Commercial Facility',
    location: 'Chakdara, Swat, KPK',
    capacity: '25 kW',
    category: 'Commercial Solar',
    completionYear: '2023',
    summary: 'High-efficiency solar array engineered for mountainous terrain with customized heavy-duty steel mounting.',
    fullStory: 'Engineered specifically for rugged northern topography in Chakdara, Swat, featuring elevated galvanized steel mounting structures.',
    mainImage: '/images/project-swat.jpg',
    gallery: ['/images/project-swat.jpg'],
    isFeatured: true,
    status: 'published',
  },
  {
    id: 'proj-3',
    title: 'Punjab Pharmacy Rooftop Solar',
    slug: 'punjab-pharmacy',
    client: 'Punjab Pharmacy Logistics',
    location: 'Lahore, Punjab, Pakistan',
    capacity: '50 kW',
    category: 'Commercial Solar',
    completionYear: '2024',
    summary: 'Turnkey commercial rooftop solar project powering climate-controlled pharmaceutical storage.',
    fullStory: 'Designed and commissioned a 50kW commercial solar system for Punjab Pharmacy in Lahore to secure uninterrupted clean power.',
    mainImage: '/images/project-pharmacy.jpg',
    gallery: ['/images/project-pharmacy.jpg'],
    isFeatured: true,
    status: 'published',
  },
];

function mapProjectRow(row: any): Project {
  return {
    id: String(row.id),
    title: row.title,
    slug: row.slug,
    client: row.client,
    location: row.location,
    capacity: row.capacity,
    category: row.category,
    completionYear: String(row.completion_year),
    summary: row.summary,
    fullStory: row.full_story,
    mainImage: row.main_image,
    gallery: row.gallery || [],
    isFeatured: Boolean(row.is_featured),
    status: (row.status as 'published' | 'draft' | 'archived') || 'published',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProjectToRow(project: Omit<Project, 'id'>) {
  return {
    title: project.title,
    slug: project.slug,
    client: project.client,
    location: project.location,
    capacity: project.capacity,
    category: project.category,
    completion_year: project.completionYear,
    summary: project.summary,
    full_story: project.fullStory,
    main_image: project.mainImage,
    gallery: project.gallery || [],
    is_featured: Boolean(project.isFeatured),
    status: project.status || 'published',
  };
}

export class ProjectsService {
  static async getAllProjects(): Promise<Project[]> {
    const adminClient = getSupabaseAdminClient();
    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data, error } = await adminClient
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapProjectRow);
        }
      } catch (err) {
        console.warn('ProjectsService.getAllProjects error, falling back:', err);
      }
    }
    return [...inMemoryProjects];
  }

  static async getPublishedProjects(): Promise<Project[]> {
    const supabase = getSupabaseAnonClient() || getSupabaseAdminClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .or('status.eq.published,status.is.null')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapProjectRow);
        }
      } catch (err) {
        console.warn('ProjectsService.getPublishedProjects error, falling back:', err);
      }
    }

    const all = await this.getAllProjects();
    return all.filter((p) => p.status === 'published' || p.status === undefined);
  }

  static async getProjectById(id: string): Promise<Project | null> {
    const adminClient = getSupabaseAdminClient();
    if (adminClient && isSupabaseConfigured() && isValidUuid(id)) {
      try {
        const { data, error } = await adminClient
          .from('projects')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return mapProjectRow(data);
        }
      } catch (err) {
        console.warn('ProjectsService.getProjectById error, falling back:', err);
      }
    }

    const all = await this.getAllProjects();
    return all.find((p) => p.id === id) || null;
  }

  static async getProjectBySlug(slug: string): Promise<Project | null> {
    const supabase = getSupabaseAnonClient() || getSupabaseAdminClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          return mapProjectRow(data);
        }
      } catch (err) {
        console.warn('ProjectsService.getProjectBySlug error, falling back:', err);
      }
    }

    const all = await this.getAllProjects();
    return all.find((p) => p.slug === slug) || null;
  }

  static async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    const rowData = mapProjectToRow(projectData);
    const adminClient = getSupabaseAdminClient();

    if (adminClient && isSupabaseConfigured()) {
      try {
        const { data, error } = await adminClient
          .from('projects')
          .insert(rowData)
          .select()
          .single();

        if (!error && data) {
          const created = mapProjectRow(data);
          inMemoryProjects = [created, ...inMemoryProjects.filter((p) => p.id !== created.id)];
          return created;
        } else if (error) {
          console.warn('Supabase createProject warning (falling back to in-memory):', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase createProject exception (falling back to in-memory):', err.message);
      }
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

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const adminClient = getSupabaseAdminClient();

    if (adminClient && isSupabaseConfigured() && isValidUuid(id)) {
      try {
        const rowUpdates: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (updates.title !== undefined) rowUpdates.title = updates.title;
        if (updates.slug !== undefined) rowUpdates.slug = updates.slug;
        if (updates.client !== undefined) rowUpdates.client = updates.client;
        if (updates.location !== undefined) rowUpdates.location = updates.location;
        if (updates.capacity !== undefined) rowUpdates.capacity = updates.capacity;
        if (updates.category !== undefined) rowUpdates.category = updates.category;
        if (updates.completionYear !== undefined) rowUpdates.completion_year = updates.completionYear;
        if (updates.summary !== undefined) rowUpdates.summary = updates.summary;
        if (updates.fullStory !== undefined) rowUpdates.full_story = updates.fullStory;
        if (updates.mainImage !== undefined) rowUpdates.main_image = updates.mainImage;
        if (updates.gallery !== undefined) rowUpdates.gallery = updates.gallery;
        if (updates.isFeatured !== undefined) rowUpdates.is_featured = Boolean(updates.isFeatured);
        if (updates.status !== undefined) rowUpdates.status = updates.status;

        const { data, error } = await adminClient
          .from('projects')
          .update(rowUpdates)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          const updated = mapProjectRow(data);
          const memIdx = inMemoryProjects.findIndex((p) => p.id === id);
          if (memIdx !== -1) inMemoryProjects[memIdx] = updated;
          else inMemoryProjects.push(updated);
          return updated;
        }
      } catch (err: any) {
        console.warn('Supabase updateProject exception (falling back to in-memory):', err.message);
      }
    }

    const existing = await this.getProjectById(id);
    if (!existing) return null;

    const updatedProject: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const currentIdx = inMemoryProjects.findIndex((p) => p.id === id);
    if (currentIdx !== -1) inMemoryProjects[currentIdx] = updatedProject;
    else inMemoryProjects.push(updatedProject);

    return updatedProject;
  }

  static async deleteProject(id: string): Promise<boolean> {
    const adminClient = getSupabaseAdminClient();

    if (adminClient && isSupabaseConfigured() && isValidUuid(id)) {
      try {
        const { error } = await adminClient.from('projects').delete().eq('id', id);
        if (error) {
          console.warn('Supabase deleteProject warning (falling back to in-memory):', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase deleteProject exception (falling back to in-memory):', err.message);
      }
    }

    inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
    return true;
  }

  static async isSlugUnique(slug: string, currentId?: string): Promise<boolean> {
    const adminClient = getSupabaseAdminClient();

    if (adminClient && isSupabaseConfigured()) {
      try {
        let query = adminClient.from('projects').select('id').eq('slug', slug);
        if (currentId && isValidUuid(currentId)) {
          query = query.neq('id', currentId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return false;
        }
      } catch (err) {
        console.warn('isSlugUnique check error:', err);
      }
    }

    return !inMemoryProjects.some((p) => p.slug === slug && p.id !== currentId);
  }
}
