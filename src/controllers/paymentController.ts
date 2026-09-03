// @ts-nocheck
import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';
import { Client } from '../models/Client';

export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: Client, as: 'client', attributes: ['clientName', 'companyName'] },
        { model: Invoice, as: 'invoice', attributes: ['invoiceNumber', 'grandTotal'] }
      ],
      order: [['paymentDate', 'DESC']]
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: Invoice, as: 'invoice' }
      ]
    });
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const paymentData = req.body;

    const invoice = await Invoice.findByPk(paymentData.invoiceId);
    if (!invoice) {
      await t.rollback();
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    const count = await Payment.count();
    paymentData.receiptNumber = `RCT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    paymentData.clientId = invoice.clientId;

    const payment = await Payment.create(paymentData, { transaction: t });

    // Update Invoice Amount Paid & Balance
    const newAmountPaid = Number(invoice.amountPaid) + Number(payment.amount);
    const newBalanceDue = Number(invoice.grandTotal) - newAmountPaid;
    
    let newStatus = invoice.status;
    if (newBalanceDue <= 0) {
      newStatus = 'Paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'Partially Paid';
    }

    await invoice.update({
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue > 0 ? newBalanceDue : 0,
      status: newStatus
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const paymentId = req.params.id;
    const paymentData = req.body;

    const oldPayment = await Payment.findByPk(paymentId);
    if (!oldPayment) {
      await t.rollback();
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    const invoice = await Invoice.findByPk(oldPayment.invoiceId);
    if (!invoice) {
      await t.rollback();
      res.status(404).json({ success: false, message: 'Associated invoice not found' });
      return;
    }

    // Calculate difference (new - old)
    const amountDifference = Number(paymentData.amount) - Number(oldPayment.amount);

    // Update payment
    await oldPayment.update(paymentData, { transaction: t });

    // Update invoice
    const newAmountPaid = Number(invoice.amountPaid) + amountDifference;
    const newBalanceDue = Number(invoice.grandTotal) - newAmountPaid;

    let newStatus = 'Unpaid';
    if (newBalanceDue <= 0 && invoice.grandTotal > 0) {
      newStatus = 'Paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'Partially Paid';
    }

    await invoice.update({
      amountPaid: newAmountPaid > 0 ? newAmountPaid : 0,
      balanceDue: newBalanceDue > 0 ? newBalanceDue : 0,
      status: newStatus
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Payment updated successfully', data: oldPayment });
  } catch (error: any) {
    await t.rollback();
    require('fs').appendFileSync('payment_error.log', JSON.stringify({ message: error.message, stack: error.stack }) + '\n');
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      await t.rollback();
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    const invoice = await Invoice.findByPk(payment.invoiceId);
    if (invoice) {
      const newAmountPaid = Number(invoice.amountPaid) - Number(payment.amount);
      const newBalanceDue = Number(invoice.grandTotal) - newAmountPaid;

      let newStatus = 'Unpaid';
      if (newBalanceDue <= 0 && invoice.grandTotal > 0) {
        newStatus = 'Paid';
      } else if (newAmountPaid > 0) {
        newStatus = 'Partially Paid';
      }

      await invoice.update({
        amountPaid: newAmountPaid > 0 ? newAmountPaid : 0,
        balanceDue: newBalanceDue,
        status: newStatus
      }, { transaction: t });
    }

    await payment.destroy({ transaction: t });
    await t.commit();
    
    res.json({ success: true, message: 'Payment deleted and Invoice updated successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

import { generateReceiptPDF } from '../services/pdfService';

export const downloadReceiptPdf = async (req: Request, res: Response): Promise<void> => {
  await generateReceiptPDF(req.params.id, res);
};
