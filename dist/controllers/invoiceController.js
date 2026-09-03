"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadInvoicePdf = exports.convertQuotationToInvoice = exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = exports.getInvoiceById = exports.getInvoices = void 0;
const database_1 = require("../config/database");
const Invoice_1 = require("../models/Invoice");
const InvoiceItem_1 = require("../models/InvoiceItem");
const Client_1 = require("../models/Client");
const Project_1 = require("../models/Project");
const Quotation_1 = require("../models/Quotation");
const QuotationItem_1 = require("../models/QuotationItem");
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice_1.Invoice.findAll({
            include: [
                { model: Client_1.Client, as: 'client', attributes: ['clientName', 'companyName'] },
                { model: Project_1.Project, as: 'project', attributes: ['projectName'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: invoices });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getInvoices = getInvoices;
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice_1.Invoice.findByPk(req.params.id, {
            include: [
                { model: Client_1.Client, as: 'client' },
                { model: Project_1.Project, as: 'project' },
                { model: InvoiceItem_1.InvoiceItem, as: 'items' }
            ]
        });
        if (!invoice) {
            res.status(404).json({ success: false, message: 'Invoice not found' });
            return;
        }
        res.json({ success: true, data: invoice });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getInvoiceById = getInvoiceById;
const createInvoice = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const { items, ...invoiceData } = req.body;
        const count = await Invoice_1.Invoice.count();
        invoiceData.invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        invoiceData.balanceDue = invoiceData.grandTotal;
        const invoice = await Invoice_1.Invoice.create(invoiceData, { transaction: t });
        if (items && items.length > 0) {
            const itemsToCreate = items.map((item) => ({
                ...item,
                invoiceId: invoice.id
            }));
            await InvoiceItem_1.InvoiceItem.bulkCreate(itemsToCreate, { transaction: t });
        }
        await t.commit();
        res.status(201).json({ success: true, message: 'Invoice created successfully', data: invoice });
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createInvoice = createInvoice;
const updateInvoice = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const { items, ...invoiceData } = req.body;
        const invoice = await Invoice_1.Invoice.findByPk(req.params.id);
        if (!invoice) {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Invoice not found' });
            return;
        }
        invoiceData.balanceDue = invoiceData.grandTotal - invoice.amountPaid;
        // Auto update status based on payment
        if (invoiceData.balanceDue <= 0 && invoiceData.grandTotal > 0) {
            invoiceData.status = 'Paid';
        }
        else if (invoice.amountPaid > 0 && invoiceData.balanceDue > 0) {
            invoiceData.status = 'Partially Paid';
        }
        await invoice.update(invoiceData, { transaction: t });
        if (items) {
            await InvoiceItem_1.InvoiceItem.destroy({ where: { invoiceId: invoice.id }, transaction: t });
            if (items.length > 0) {
                const itemsToCreate = items.map((item) => ({
                    ...item,
                    invoiceId: invoice.id
                }));
                await InvoiceItem_1.InvoiceItem.bulkCreate(itemsToCreate, { transaction: t });
            }
        }
        await t.commit();
        res.json({ success: true, message: 'Invoice updated successfully', data: invoice });
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updateInvoice = updateInvoice;
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice_1.Invoice.findByPk(req.params.id);
        if (!invoice) {
            res.status(404).json({ success: false, message: 'Invoice not found' });
            return;
        }
        await invoice.destroy();
        res.json({ success: true, message: 'Invoice deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteInvoice = deleteInvoice;
const convertQuotationToInvoice = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const quotation = await Quotation_1.Quotation.findByPk(req.params.quotationId, {
            include: [{ model: QuotationItem_1.QuotationItem, as: 'items' }]
        });
        if (!quotation) {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Quotation not found' });
            return;
        }
        // Check if already invoiced
        const existingInvoice = await Invoice_1.Invoice.findOne({ where: { quotationId: quotation.id } });
        if (existingInvoice) {
            await t.rollback();
            res.status(400).json({ success: false, message: 'Quotation has already been invoiced', data: existingInvoice });
            return;
        }
        const count = await Invoice_1.Invoice.count();
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
        const invoice = await Invoice_1.Invoice.create(invoiceData, { transaction: t });
        const items = quotation.items;
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
            await InvoiceItem_1.InvoiceItem.bulkCreate(invoiceItems, { transaction: t });
        }
        await quotation.update({ status: 'Accepted' }, { transaction: t });
        await t.commit();
        res.status(201).json({ success: true, message: 'Converted to Invoice successfully', data: invoice });
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.convertQuotationToInvoice = convertQuotationToInvoice;
const pdfService_1 = require("../services/pdfService");
const downloadInvoicePdf = async (req, res) => {
    await (0, pdfService_1.generateInvoicePDF)(req.params.id, res);
};
exports.downloadInvoicePdf = downloadInvoicePdf;
