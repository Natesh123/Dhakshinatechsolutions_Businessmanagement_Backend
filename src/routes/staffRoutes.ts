import { Router } from 'express';
import { getStaff, getStaffById, createStaff, updateStaff, deleteStaff } from '../controllers/staffController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getStaff);
router.get('/:id', getStaffById);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
