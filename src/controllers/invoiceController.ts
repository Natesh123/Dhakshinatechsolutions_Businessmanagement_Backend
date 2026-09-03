// @ts-nocheck
import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Invoice } from '../models/Invoice';
import { InvoiceItem } from '../models/InvoiceItem';
import { Client } from '../models/Client';
import { Project } from '../models/Project';
import { Quotation } from '../models/Quotation';
import { QuotationItem } from '../models/QuotationItem';

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: Client, as: 'client', attributes: ['clientName', 'companyName'] },
        { model: Project, as: 'project', attributes: ['projectName'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: Project, as: 'project' },
        { model: InvoiceItem, as: 'items' }
      ]
    });
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { items, ...invoiceData } = req.body;
    
    const count = await Invoice.count();
    invoiceData.invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    invoiceData.balanceDue = invoiceData.grandTotal;

    const invoice = await Invoice.create(invoiceData, { transaction: t });

    if (items && items.length > 0) {
      const itemsToCreate = items.map((item: any) => ({
        ...item,
        invoiceId: invoice.id
      }));
      await InvoiceItem.bulkCreate(itemsToCreate, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Invoice created successfully', data: invoice });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { items, ...invoiceData } = req.body;
    const invoice = await Invoice.findByPk(req.params.id);
    
    if (!invoice) {
      await t.rollback();
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    invoiceData.balanceDue = invoiceData.grandTotal - invoice.amountPaid;
    
    // Auto update status based on payment
    if (invoiceData.balanceDue <= 0 && invoiceData.grandTotal > 0) {
      invoiceData.status = 'Paid';
    } else if (invoice.amountPaid > 0 && invoiceData.balanceDue > 0) {
      invoiceData.status = 'Partially Paid';
    }

    await invoice.update(invoiceData, { transaction: t });

    if (items) {
      await InvoiceItem.destroy({ where: { invoiceId: invoice.id }, transaction: t });
      if (items.length > 0) {
        const itemsToCreate = items.map((item: any) => ({
          ...item,
          invoiceId: invoice.id
        }));
        await InvoiceItem.bulkCreate(itemsToCreate, { transaction: t });
      }
    }

    await t.commit();
    res.json({ success: true, message: 'Invoice updated successfully', data: invoice });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    await invoice.destroy();
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const convertQuotationToInvoice = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const quotation = await Quotation.findByPk(req.params.quotationId, {
      include: [{ model: QuotationItem, as: 'items' }]
    });

    if (!quotation) {
      await t.rollback();
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    // Check if already invoiced
    const existingInvoice = await Invoice.findOne({ where: { quotationId: quotation.id } });
    if (existingInvoice) {
      await t.rollback();
      res.status(400).json({ success: false, message: 'Quotation has already been invoiced', data: existingInvoice });
      return;
    }

    const count = await Invoice.count();
    const invoiceData = {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`,
      clientId: quotation.clientId,
      projectId: quotation.projectId,
      quotationId: quotation.id,
      invoiceDate: new Date(),
      subTotal: quotation.subTotal,
      taxTotal: quotation.taxTotal,
      discount: quotation.discount,
      grandTotal: quotation.grandTotal,
      balanceDue: quotation.grandTotal,
      amountPaid: 0,
      notes: quotation.notes,
      terms: quotation.terms,
      status: 'Unpaid'
    };

    const invoice = await Invoice.create(invoiceData, { transaction: t });

    const items = quotation.items as unknown as QuotationItem[];
    if (items && items.length > 0) {
      const invoiceItems = items.map(item => ({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        total: item.total
      }));
      await InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
    }

    await quotation.update({ status: 'Accepted' }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Converted to Invoice successfully', data: invoice });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

import { generateInvoicePDF } from '../services/pdfService';

export const downloadInvoicePdf = async (req: Request, res: Response): Promise<void> => {
  await generateInvoicePDF(req.params.id, res);
};
