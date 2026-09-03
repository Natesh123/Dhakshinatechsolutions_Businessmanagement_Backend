import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getDashboardData);

export default router;
