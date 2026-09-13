import type { Project } from './data';

// Validate the mapped API model, not the database columns or creation-form constraints.
function isProject(value: unknown): value is Project {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const project = value as Record<string, unknown>;
  const strings = [
    'id', 'title', 'slug', 'client', 'location', 'capacity', 'category', 'summary', 'mainImage',
  ] as const;

  return strings.every((field) => typeof project[field] === 'string')
    && typeof project.completionYear === 'number'
    && Number.isFinite(project.completionYear)
    && Number.isInteger(project.completionYear)
    && (project.fullStory === undefined || typeof project.fullStory === 'string')
    && Array.isArray(project.gallery)
    && project.gallery.every((item: unknown) => typeof item === 'string')
    && typeof project.isFeatured === 'boolean'
    && (project.status === undefined || project.status === 'published'
      || project.status === 'draft' || project.status === 'archived');
}

// Reject the entire response; never turn corrupt data into partial or empty success.
export function isProjectArray(value: unknown): value is Project[] {
  return Array.isArray(value) && value.every(isProject);
}
