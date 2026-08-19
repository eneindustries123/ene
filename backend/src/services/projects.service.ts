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
    client: 'MNS University Administration',
    location: 'Multan, Punjab, Pakistan',
    capacity: 'High-Capacity On-Grid Array',
    category: 'Institutional Solar',
    completionYear: '2024',
    summary: 'Turnkey solar energy installation powering campus academic blocks, research laboratories, and administrative facilities.',
    fullStory: 'E&E Industries engineered and commissioned a comprehensive solar power array at MNS University of Agriculture Multan. The project involved site load analysis, elevated structural mounting over academic rooftops, Tier-1 panel installation, and full grid synchronization.',
    mainImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1200&auto=format&fit=crop',
    ],
    isFeatured: true,
    status: 'published',
  },
  {
    id: 'proj-2',
    title: 'Chakdara Swat Site',
    slug: 'chakdara-swat-25kw',
    client: 'Regional Commercial Facility',
    location: 'Chakdara, Swat, KPK, Pakistan',
    capacity: '25KW',
    category: 'Commercial Solar',
    completionYear: '2023',
    summary: 'A 25KW solar deployment providing uninterrupted commercial power in northern mountainous terrain.',
    fullStory: 'Designed to handle high wind shear and mountain ambient weather, this 25KW commercial solar project utilizes heavy-duty galvanized mounting structures and hybrid energy storage.',
    mainImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
    status: 'published',
  },
  {
    id: 'proj-3',
    title: 'Punjab Pharmacy Commercial Complex',
    slug: 'punjab-pharmacy',
    client: 'Punjab Pharmacy Logistics',
    location: 'Lahore, Punjab, Pakistan',
    capacity: 'Commercial Hybrid System',
    category: 'Commercial & Logistics',
    completionYear: '2024',
    summary: 'Solar integration providing continuous power backup for cold storage pharmaceutical inventory.',
    fullStory: 'Ensuring 100% operational uptime for temperature-sensitive medical supplies, E&E Industries installed custom solar arrays paired with instant hybrid battery transfer switches.',
    mainImage: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
    status: 'published',
  },
  {
    id: 'proj-4',
    title: 'Chitral Remote Site Deployment',
    slug: 'chitral-site-50kw',
    client: 'Chitral Infrastructure Project',
    location: 'Chitral, KPK, Pakistan',
    capacity: '50KW',
    category: 'Infrastructure & Solar',
    completionYear: '2023',
    summary: 'A 50KW off-grid/hybrid solar project powering remote infrastructure and regional operational hubs.',
    fullStory: 'Navigating rugged mountain transport routes, E&E delivered specialized procurement, steel fabrication, and on-site engineering commissioning.',
    mainImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
    status: 'published',
  },
  {
    id: 'proj-5',
    title: 'Punjab Group of Pharmacies Central Hub',
    slug: 'punjab-group-of-pharmacies-55kw',
    client: 'Punjab Group of Pharmacies',
    location: 'Gujranwala, Punjab, Pakistan',
    capacity: '55KW',
    category: 'Commercial Solar',
    completionYear: '2024',
    summary: '55KW commercial solar facility cutting peak grid power costs by over 70%.',
    fullStory: 'Engineered for optimal daytime load offset, this 55KW system features net metering integration and continuous IoT telemetry monitoring.',
    mainImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
    status: 'published',
  },
  {
    id: 'proj-6',
    title: 'Bareeze DHA Elevated Shed Structure',
    slug: 'bareeze-dha-40kw-elevated-shed',
    client: 'Bareeze Retail Network',
    location: 'DHA, Lahore, Pakistan',
    capacity: '40KW Elevated Shed',
    category: 'Fabrication & Solar',
    completionYear: '2024',
    summary: '40KW solar installation mounted on a custom-designed elevated structural steel roof shed.',
    fullStory: 'Combining our fabrication and solar services, E&E Industrial Corporation engineered an aesthetic elevated steel roof structure over existing retail rooftop space to accommodate 40KW of solar modules without disturbing store operations.',
    mainImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
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
