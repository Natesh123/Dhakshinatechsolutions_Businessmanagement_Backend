import { Router } from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  getProjectNotes,
  createProjectNote,
  deleteProjectNote,
  getAllProjectNotes
} from '../controllers/projectController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Note routes
router.get('/notes/all', getAllProjectNotes);
router.get('/:id/notes', getProjectNotes);
router.post('/:id/notes', createProjectNote);
router.delete('/notes/:noteId', deleteProjectNote);

export default router;
