import { Router } from 'express';
import { getClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clientController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT); // Protect all client routes

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
