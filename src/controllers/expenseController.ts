// @ts-nocheck
import { Request, Response } from 'express';
import { Expense } from '../models/Expense';

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await Expense.findAll({
      order: [['expenseDate', 'DESC']]
    });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getExpenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, message: 'Expense created successfully', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }
    await expense.update(req.body);
    res.json({ success: true, message: 'Expense updated successfully', data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }
    await expense.destroy();
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};
