"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalaryPayment = exports.updateSalaryPayment = exports.createSalaryPayment = exports.getSalaryPaymentById = exports.getSalaryPayments = void 0;
const SalaryPayment_1 = require("../models/SalaryPayment");
const Staff_1 = require("../models/Staff");
const getSalaryPayments = async (req, res) => {
    try {
        const payments = await SalaryPayment_1.SalaryPayment.findAll({
            include: [{ model: Staff_1.Staff, as: 'staff' }],
            order: [['paymentDate', 'DESC']]
        });
        res.json({ success: true, data: payments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getSalaryPayments = getSalaryPayments;
const getSalaryPaymentById = async (req, res) => {
    try {
        const payment = await SalaryPayment_1.SalaryPayment.findByPk(req.params.id, {
            include: [{ model: Staff_1.Staff, as: 'staff' }]
        });
        if (!payment) {
            res.status(404).json({ success: false, message: 'Salary Payment not found' });
            return;
        }
        res.json({ success: true, data: payment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getSalaryPaymentById = getSalaryPaymentById;
const createSalaryPayment = async (req, res) => {
    try {
        const payment = await SalaryPayment_1.SalaryPayment.create(req.body);
        res.status(201).json({ success: true, message: 'Salary Payment recorded successfully', data: payment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createSalaryPayment = createSalaryPayment;
const updateSalaryPayment = async (req, res) => {
    try {
        const payment = await SalaryPayment_1.SalaryPayment.findByPk(req.params.id);
        if (!payment) {
            res.status(404).json({ success: false, message: 'Salary Payment not found' });
            return;
        }
        await payment.update(req.body);
        res.json({ success: true, message: 'Salary Payment updated successfully', data: payment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updateSalaryPayment = updateSalaryPayment;
const deleteSalaryPayment = async (req, res) => {
    try {
        const payment = await SalaryPayment_1.SalaryPayment.findByPk(req.params.id);
        if (!payment) {
            res.status(404).json({ success: false, message: 'Salary Payment not found' });
            return;
        }
        await payment.destroy();
        res.json({ success: true, message: 'Salary Payment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteSalaryPayment = deleteSalaryPayment;
