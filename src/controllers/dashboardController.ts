import { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { Invoice } from '../models/Invoice';
import { Payment } from '../models/Payment';
import { Expense } from '../models/Expense';
import { SalaryPayment } from '../models/SalaryPayment';
import { Client } from '../models/Client';
import { Op } from 'sequelize';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // 1. Key Metrics
    const totalIncomeResult = await Payment.sum('amount');
    const totalIncome = totalIncomeResult || 0;

    const totalExpenseResult = await Expense.sum('amount');
    const totalSalaryResult = await SalaryPayment.sum('netSalary');
    const totalExpenses = (totalExpenseResult || 0) + (totalSalaryResult || 0);

    const pendingInvoices = await Invoice.sum('balanceDue', {
      where: { balanceDue: { [Op.gt]: 0 } }
    });
    const totalReceivables = pendingInvoices || 0;

    const totalClients = await Client.count();

    // 2. Monthly Income vs Expense (Last 6 Months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      const monthName = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' });

      const mIncome = await Payment.sum('amount', {
        where: { paymentDate: { [Op.between]: [monthStart, monthEnd] } }
      }) || 0;

      const mExp = await Expense.sum('amount', {
        where: { expenseDate: { [Op.between]: [monthStart, monthEnd] } }
      }) || 0;
      
      const mSal = await SalaryPayment.sum('netSalary', {
        where: { paymentDate: { [Op.between]: [monthStart, monthEnd] } }
      }) || 0;

      monthlyData.push({
        month: monthName,
        income: mIncome,
        expense: mExp + mSal
      });
    }

    // 3. Recent Activity (Last 5 Payments & Last 5 Invoices)
    const recentPayments = await Payment.findAll({
      limit: 5,
      order: [['paymentDate', 'DESC']],
      include: [{ model: Client, as: 'client', attributes: ['clientName'] }]
    });

    const recentInvoices = await Invoice.findAll({
      limit: 5,
      order: [['invoiceDate', 'DESC']],
      include: [{ model: Client, as: 'client', attributes: ['clientName'] }]
    });

    const currentBalance = totalIncome - totalExpenses;

    res.json({
      success: true,
      data: {
        metrics: {
          totalIncome,
          totalExpenses,
          currentBalance,
          totalReceivables,
          totalClients
        },
        chartData: monthlyData,
        recentPayments,
        recentInvoices
      }
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};
