import { Router } from 'express';
import { ProjectsController } from '../controllers/projects.controller';
import { requireAdminAuth } from '../middleware/auth';

export const projectsRouter = Router();

// Public routes
projectsRouter.get('/', ProjectsController.getAll);
projectsRouter.get('/:idOrSlug', ProjectsController.getByIdOrSlug);

// Protected Admin routes
projectsRouter.post('/', requireAdminAuth, ProjectsController.create);
projectsRouter.put('/:id', requireAdminAuth, ProjectsController.update);
projectsRouter.patch('/:id', requireAdminAuth, ProjectsController.update);
projectsRouter.delete('/:id', requireAdminAuth, ProjectsController.delete);
