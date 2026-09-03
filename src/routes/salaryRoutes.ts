import { Router } from 'express';
import { getSalaryPayments, getSalaryPaymentById, createSalaryPayment, updateSalaryPayment, deleteSalaryPayment } from '../controllers/salaryController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getSalaryPayments);
router.get('/:id', getSalaryPaymentById);
router.post('/', createSalaryPayment);
router.put('/:id', updateSalaryPayment);
router.delete('/:id', deleteSalaryPayment);

export default router;
