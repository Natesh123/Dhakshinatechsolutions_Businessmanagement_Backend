// @ts-nocheck
import { Request, Response } from 'express';
import { SalaryPayment } from '../models/SalaryPayment';
import { Staff } from '../models/Staff';

export const getSalaryPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await SalaryPayment.findAll({
      include: [{ model: Staff, as: 'staff' }],
      order: [['paymentDate', 'DESC']]
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getSalaryPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await SalaryPayment.findByPk(req.params.id, {
      include: [{ model: Staff, as: 'staff' }]
    });
    if (!payment) {
      res.status(404).json({ success: false, message: 'Salary Payment not found' });
      return;
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createSalaryPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await SalaryPayment.create(req.body);
    res.status(201).json({ success: true, message: 'Salary Payment recorded successfully', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updateSalaryPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await SalaryPayment.findByPk(req.params.id);
    if (!payment) {
      res.status(404).json({ success: false, message: 'Salary Payment not found' });
      return;
    }
    await payment.update(req.body);
    res.json({ success: true, message: 'Salary Payment updated successfully', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteSalaryPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await SalaryPayment.findByPk(req.params.id);
    if (!payment) {
      res.status(404).json({ success: false, message: 'Salary Payment not found' });
      return;
    }
    await payment.destroy();
    res.json({ success: true, message: 'Salary Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};
