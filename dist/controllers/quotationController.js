"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadQuotationPdf = exports.deleteQuotation = exports.updateQuotation = exports.createQuotation = exports.getQuotationById = exports.getQuotations = void 0;
const database_1 = require("../config/database");
const Quotation_1 = require("../models/Quotation");
const QuotationItem_1 = require("../models/QuotationItem");
const Client_1 = require("../models/Client");
const Project_1 = require("../models/Project");
const getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation_1.Quotation.findAll({
            include: [
                { model: Client_1.Client, as: 'client', attributes: ['clientName', 'companyName'] },
                { model: Project_1.Project, as: 'project', attributes: ['projectName'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: quotations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getQuotations = getQuotations;
const getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation_1.Quotation.findByPk(req.params.id, {
            include: [
                { model: Client_1.Client, as: 'client' },
                { model: Project_1.Project, as: 'project' },
                { model: QuotationItem_1.QuotationItem, as: 'items' }
            ]
        });
        if (!quotation) {
            res.status(404).json({ success: false, message: 'Quotation not found' });
            return;
        }
        res.json({ success: true, data: quotation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getQuotationById = getQuotationById;
const createQuotation = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const { items, ...quotationData } = req.body;
        // Auto-generate quotation number (Simplistic for now, can be improved based on CompanySettings)
        const count = await Quotation_1.Quotation.count();
        quotationData.quotationNumber = `QTN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        const quotation = await Quotation_1.Quotation.create(quotationData, { transaction: t });
        if (items && items.length > 0) {
            const itemsToCreate = items.map((item) => ({
                ...item,
                quotationId: quotation.id
            }));
            await QuotationItem_1.QuotationItem.bulkCreate(itemsToCreate, { transaction: t });
        }
        await t.commit();
        res.status(201).json({ success: true, message: 'Quotation created successfully', data: quotation });
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createQuotation = createQuotation;
const updateQuotation = async (req, res) => {
    const t = await database_1.sequelize.transaction();
    try {
        const { items, ...quotationData } = req.body;
        const quotation = await Quotation_1.Quotation.findByPk(req.params.id);
        if (!quotation) {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Quotation not found' });
            return;
        }
        await quotation.update(quotationData, { transaction: t });
        if (items) {
            // Simplest approach: Delete existing items and recreate
            await QuotationItem_1.QuotationItem.destroy({ where: { quotationId: quotation.id }, transaction: t });
            if (items.length > 0) {
                const itemsToCreate = items.map((item) => ({
                    ...item,
                    quotationId: quotation.id
                }));
                await QuotationItem_1.QuotationItem.bulkCreate(itemsToCreate, { transaction: t });
            }
        }
        await t.commit();
        res.json({ success: true, message: 'Quotation updated successfully', data: quotation });
    }
    catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updateQuotation = updateQuotation;
const deleteQuotation = async (req, res) => {
    try {
        const quotation = await Quotation_1.Quotation.findByPk(req.params.id);
        if (!quotation) {
            res.status(404).json({ success: false, message: 'Quotation not found' });
            return;
        }
        // Items will be deleted automatically due to ON DELETE CASCADE
        await quotation.destroy();
        res.json({ success: true, message: 'Quotation deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteQuotation = deleteQuotation;
const pdfService_1 = require("../services/pdfService");
const downloadQuotationPdf = async (req, res) => {
    await (0, pdfService_1.generateQuotationPDF)(req.params.id, res);
};
exports.downloadQuotationPdf = downloadQuotationPdf;
