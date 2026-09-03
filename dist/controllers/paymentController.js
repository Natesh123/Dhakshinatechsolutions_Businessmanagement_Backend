"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadReceiptPdf = exports.deletePayment = exports.updatePayment = exports.createPayment = exports.getPaymentById = exports.getPayments = void 0;
const database_1 = require("../config/database");
const Payment_1 = require("../models/Payment");
const Invoice_1 = require("../models/Invoice");
const Client_1 = require("../models/Client");
const getPayments = async (req, res) => {
    try {
        const payments = await Payment_1.Payment.findAll({
            include: [
                { model: Client_1.Client, as: 'client', attributes: ['clientName', 'companyName'] },
                { model: Invoice_1.Invoice, as: 'invoice', attributes: ['invoiceNumber', 'grandTotal'] }
            ],
            order: [['paymentDate', 'DESC']]
        });
        res.json({ success: true, data: payments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getPayments = getPayments;
const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment_1.Payment.findByPk(req.params.id, {
            include: [
                { model: Client_1.Client, as: 'client' },
                { model: Invoice_1.Invoice, as: 'invoice' }
            ]
        });
        if (!payment) {
            res.status(404).json({ success: false, message: 'Payment not found' });
            return;
        }
        res.json({ success: true, data: payment });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getPaymentById = getPaymentById;
const createPayment = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const paymentData = req.body;
        const invoice = await Invoice_1.Invoice.findByPk(paymentData.invoiceId);
        if (!invoice) {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Invoice not found' });
            return;
        }
        const count = await Payment_1.Payment.count();
        paymentData.receiptNumber = `RCT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        paymentData.clientId = invoice.clientId;
        const payment = await Payment_1.Payment.create(paymentData, { transaction: t });
        // Update Invoice Amount Paid & Balance
        const newAmountPaid = Number(invoice.amountPaid) + Number(payment.amount);
        const newBalanceDue = Number(invoice.grandTotal) - newAmountPaid;
        let newStatus = invoice.status;
        if (newBalanceDue <= 0) {
            newStatus = 'Paid';
        }
        else if (newAmountPaid > 0) {
            newStatus = 'Partially Paid';
        }
        await invoice.update({
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue > 0 ? newBalanceDue : 0,
            status: newStatus
        }, { transaction: t });
        await t.commit();
        res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createPayment = createPayment;
const updatePayment = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const paymentId = req.params.id;
        const paymentData = req.body;
        const oldPayment = await Payment_1.Payment.findByPk(paymentId);
        if (!oldPayment) {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Payment not found' });
            return;
        }
        const invoice = await Invoice_1.Invoice.findByPk(oldPayment.invoiceId);
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
        }
        else if (newAmountPaid > 0) {
            newStatus = 'Partially Paid';
        }
        await invoice.update({
            amountPaid: newAmountPaid > 0 ? newAmountPaid : 0,
            balanceDue: newBalanceDue > 0 ? newBalanceDue : 0,
            status: newStatus
        }, { transaction: t });
        await t.commit();
        res.json({ success: true, message: 'Payment updated successfully', data: oldPayment });
    }
    catch (error) {
        await t.rollback();
        require('fs').appendFileSync('payment_error.log', JSON.stringify({ message: error.message, stack: error.stack }) + '\n');
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updatePayment = updatePayment;
const deletePayment = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const payment = await Payment_1.Payment.findByPk(req.params.id);
        if (!payment) {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Payment not found' });
            return;
        }
        const invoice = await Invoice_1.Invoice.findByPk(payment.invoiceId);
        if (invoice) {
            const newAmountPaid = Number(invoice.amountPaid) - Number(payment.amount);
            const newBalanceDue = Number(invoice.grandTotal) - newAmountPaid;
            let newStatus = 'Unpaid';
            if (newBalanceDue <= 0 && invoice.grandTotal > 0) {
                newStatus = 'Paid';
            }
            else if (newAmountPaid > 0) {
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
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deletePayment = deletePayment;
const pdfService_1 = require("../services/pdfService");
const downloadReceiptPdf = async (req, res) => {
    await (0, pdfService_1.generateReceiptPDF)(req.params.id, res);
};
exports.downloadReceiptPdf = downloadReceiptPdf;
