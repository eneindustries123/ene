import { Request, Response } from 'express';
import { ProjectsService } from '../services/projects.service';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

export class ProjectsController {
  static async getAll(req: Request, res: Response) {
    try {
      const { status, featured, limit } = req.query;
      const parsedLimit = limit ? Math.max(1, Math.min(50, parseInt(String(limit), 10) || 0)) : undefined;

      if (status === 'published' && featured === 'true') {
        const projects = await ProjectsService.getFeaturedPublishedProjects(parsedLimit || 3);
        return res.status(200).json(projects);
      }
      if (status === 'published') {
        const projects = await ProjectsService.getPublishedProjects();
        return res.status(200).json(projects);
      }
      const projects = await ProjectsService.getAllProjects();
      return res.status(200).json(projects);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch projects' });
    }
  }

  static async getByIdOrSlug(req: Request, res: Response) {
    try {
      const { idOrSlug } = req.params;
      let project = await ProjectsService.getProjectById(idOrSlug);
      if (!project) {
        project = await ProjectsService.getProjectBySlug(idOrSlug);
      }

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json(project);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch project' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const parsedData = createProjectSchema.parse(req.body);

      // Validate slug uniqueness
      const isUnique = await ProjectsService.isSlugUnique(parsedData.slug);
      if (!isUnique) {
        return res.status(409).json({ error: 'A project with this URL slug already exists' });
      }

      // Enforce maximum 3 published featured projects
      if (parsedData.isFeatured && (parsedData.status === 'published' || !parsedData.status)) {
        const currentFeaturedCount = await ProjectsService.countPublishedFeaturedProjects();
        if (currentFeaturedCount >= 3) {
          return res.status(409).json({
            error: 'You can feature a maximum of 3 projects. Unfeature another project first.',
          });
        }
      }

      const created = await ProjectsService.createProject(parsedData);
      return res.status(201).json(created);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
      }
      return res.status(500).json({ error: err.message || 'Failed to create project' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsedUpdates = updateProjectSchema.parse(req.body);

      if (parsedUpdates.slug) {
        const isUnique = await ProjectsService.isSlugUnique(parsedUpdates.slug, id);
        if (!isUnique) {
          return res.status(409).json({ error: 'A project with this URL slug already exists' });
        }
      }

      const existing = await ProjectsService.getProjectById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const willBeFeatured =
        parsedUpdates.isFeatured !== undefined ? Boolean(parsedUpdates.isFeatured) : existing.isFeatured;
      const willBePublished =
        (parsedUpdates.status !== undefined ? parsedUpdates.status : existing.status) === 'published';

      // Enforce maximum 3 published featured projects
      if (willBeFeatured && willBePublished) {
        const otherFeaturedCount = await ProjectsService.countPublishedFeaturedProjects(id);
        if (otherFeaturedCount >= 3) {
          return res.status(409).json({
            error: 'You can feature a maximum of 3 projects. Unfeature another project first.',
          });
        }
      }

      const updated = await ProjectsService.updateProject(id, parsedUpdates);
      if (!updated) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json(updated);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
      }
      return res.status(500).json({ error: err.message || 'Failed to update project' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await ProjectsService.deleteProject(id);
      return res.status(200).json({ success, message: 'Project permanently deleted' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to delete project' });
    }
  }
}
