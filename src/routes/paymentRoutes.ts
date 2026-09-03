import { Router } from 'express';
import { getPayments, getPaymentById, createPayment, updatePayment, deletePayment, downloadReceiptPdf } from '../controllers/paymentController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.put('/:id', updatePayment);

router.use(authenticateJWT);

router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.get('/:id/pdf', downloadReceiptPdf);
router.post('/', createPayment);
router.delete('/:id', deletePayment);

export default router;
