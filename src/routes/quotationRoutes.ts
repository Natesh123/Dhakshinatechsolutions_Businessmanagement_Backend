import { Router } from 'express';
import { getQuotations, getQuotationById, createQuotation, updateQuotation, deleteQuotation, downloadQuotationPdf } from '../controllers/quotationController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getQuotations);
router.get('/:id', getQuotationById);
router.get('/:id/pdf', downloadQuotationPdf);
router.post('/', createQuotation);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

export default router;
