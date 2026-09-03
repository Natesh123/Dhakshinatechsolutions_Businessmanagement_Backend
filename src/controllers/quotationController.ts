// @ts-nocheck
import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Quotation } from '../models/Quotation';
import { QuotationItem } from '../models/QuotationItem';
import { Client } from '../models/Client';
import { Project } from '../models/Project';

export const getQuotations = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotations = await Quotation.findAll({
      include: [
        { model: Client, as: 'client', attributes: ['clientName', 'companyName'] },
        { model: Project, as: 'project', attributes: ['projectName'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getQuotationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: Project, as: 'project' },
        { model: QuotationItem, as: 'items' }
      ]
    });
    if (!quotation) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }
    res.json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createQuotation = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { items, ...quotationData } = req.body;
    
    // Auto-generate quotation number (Simplistic for now, can be improved based on CompanySettings)
    const count = await Quotation.count();
    quotationData.quotationNumber = `QTN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const quotation = await Quotation.create(quotationData, { transaction: t });

    if (items && items.length > 0) {
      const itemsToCreate = items.map((item: any) => ({
        ...item,
        quotationId: quotation.id
      }));
      await QuotationItem.bulkCreate(itemsToCreate, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Quotation created successfully', data: quotation });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updateQuotation = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { items, ...quotationData } = req.body;
    const quotation = await Quotation.findByPk(req.params.id);
    
    if (!quotation) {
      await t.rollback();
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }

    await quotation.update(quotationData, { transaction: t });

    if (items) {
      // Simplest approach: Delete existing items and recreate
      await QuotationItem.destroy({ where: { quotationId: quotation.id }, transaction: t });
      
      if (items.length > 0) {
        const itemsToCreate = items.map((item: any) => ({
          ...item,
          quotationId: quotation.id
        }));
        await QuotationItem.bulkCreate(itemsToCreate, { transaction: t });
      }
    }

    await t.commit();
    res.json({ success: true, message: 'Quotation updated successfully', data: quotation });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteQuotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotation = await Quotation.findByPk(req.params.id);
    if (!quotation) {
      res.status(404).json({ success: false, message: 'Quotation not found' });
      return;
    }
    // Items will be deleted automatically due to ON DELETE CASCADE
    await quotation.destroy();
    res.json({ success: true, message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

import { generateQuotationPDF } from '../services/pdfService';

export const downloadQuotationPdf = async (req: Request, res: Response): Promise<void> => {
  await generateQuotationPDF(req.params.id, res);
};
