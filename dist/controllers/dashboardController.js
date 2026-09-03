"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const Invoice_1 = require("../models/Invoice");
const Payment_1 = require("../models/Payment");
const Expense_1 = require("../models/Expense");
const SalaryPayment_1 = require("../models/SalaryPayment");
const Client_1 = require("../models/Client");
const sequelize_1 = require("sequelize");
const getDashboardData = async (req, res) => {
    try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // 1. Key Metrics
        const totalIncomeResult = await Payment_1.Payment.sum('amount');
        const totalIncome = totalIncomeResult || 0;
        const totalExpenseResult = await Expense_1.Expense.sum('amount');
        const totalSalaryResult = await SalaryPayment_1.SalaryPayment.sum('netSalary');
        const totalExpenses = (totalExpenseResult || 0) + (totalSalaryResult || 0);
        const pendingInvoices = await Invoice_1.Invoice.sum('balanceDue', {
            where: { balanceDue: { [sequelize_1.Op.gt]: 0 } }
        });
        const totalReceivables = pendingInvoices || 0;
        const totalClients = await Client_1.Client.count();
        // 2. Monthly Income vs Expense (Last 6 Months)
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
            const monthName = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' });
            const mIncome = await Payment_1.Payment.sum('amount', {
                where: { paymentDate: { [sequelize_1.Op.between]: [monthStart, monthEnd] } }
            }) || 0;
            const mExp = await Expense_1.Expense.sum('amount', {
                where: { expenseDate: { [sequelize_1.Op.between]: [monthStart, monthEnd] } }
            }) || 0;
            const mSal = await SalaryPayment_1.SalaryPayment.sum('netSalary', {
                where: { paymentDate: { [sequelize_1.Op.between]: [monthStart, monthEnd] } }
            }) || 0;
            monthlyData.push({
                month: monthName,
                income: mIncome,
                expense: mExp + mSal
            });
        }
        // 3. Recent Activity (Last 5 Payments & Last 5 Invoices)
        const recentPayments = await Payment_1.Payment.findAll({
            limit: 5,
            order: [['paymentDate', 'DESC']],
            include: [{ model: Client_1.Client, as: 'client', attributes: ['clientName'] }]
        });
        const recentInvoices = await Invoice_1.Invoice.findAll({
            limit: 5,
            order: [['invoiceDate', 'DESC']],
            include: [{ model: Client_1.Client, as: 'client', attributes: ['clientName'] }]
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
    }
    catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getDashboardData = getDashboardData;
