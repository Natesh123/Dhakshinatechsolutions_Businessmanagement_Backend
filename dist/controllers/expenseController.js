"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenseById = exports.getExpenses = void 0;
const Expense_1 = require("../models/Expense");
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense_1.Expense.findAll({
            order: [['expenseDate', 'DESC']]
        });
        res.json({ success: true, data: expenses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getExpenses = getExpenses;
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense_1.Expense.findByPk(req.params.id);
        if (!expense) {
            res.status(404).json({ success: false, message: 'Expense not found' });
            return;
        }
        res.json({ success: true, data: expense });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getExpenseById = getExpenseById;
const createExpense = async (req, res) => {
    try {
        const expense = await Expense_1.Expense.create(req.body);
        res.status(201).json({ success: true, message: 'Expense created successfully', data: expense });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createExpense = createExpense;
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense_1.Expense.findByPk(req.params.id);
        if (!expense) {
            res.status(404).json({ success: false, message: 'Expense not found' });
            return;
        }
        await expense.update(req.body);
        res.json({ success: true, message: 'Expense updated successfully', data: expense });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense_1.Expense.findByPk(req.params.id);
        if (!expense) {
            res.status(404).json({ success: false, message: 'Expense not found' });
            return;
        }
        await expense.destroy();
        res.json({ success: true, message: 'Expense deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteExpense = deleteExpense;
