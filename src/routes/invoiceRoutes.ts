import { Router } from 'express';
import { getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, downloadInvoicePdf, convertQuotationToInvoice } from '../controllers/invoiceController';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.get('/:id/pdf', downloadInvoicePdf);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

router.post('/convert-quotation/:quotationId', convertQuotationToInvoice);

export default router;
