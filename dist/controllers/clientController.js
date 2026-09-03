"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClientById = exports.getClients = void 0;
const Client_1 = require("../models/Client");
const getClients = async (req, res) => {
    try {
        const clients = await Client_1.Client.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: clients });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getClients = getClients;
const getClientById = async (req, res) => {
    try {
        const client = await Client_1.Client.findByPk(req.params.id);
        if (!client) {
            res.status(404).json({ success: false, message: 'Client not found' });
            return;
        }
        res.json({ success: true, data: client });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getClientById = getClientById;
const createClient = async (req, res) => {
    try {
        const client = await Client_1.Client.create(req.body);
        res.status(201).json({ success: true, message: 'Client created successfully', data: client });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createClient = createClient;
const updateClient = async (req, res) => {
    try {
        const client = await Client_1.Client.findByPk(req.params.id);
        if (!client) {
            res.status(404).json({ success: false, message: 'Client not found' });
            return;
        }
        await client.update(req.body);
        res.json({ success: true, message: 'Client updated successfully', data: client });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updateClient = updateClient;
const deleteClient = async (req, res) => {
    try {
        const client = await Client_1.Client.findByPk(req.params.id);
        if (!client) {
            res.status(404).json({ success: false, message: 'Client not found' });
            return;
        }
        await client.destroy();
        res.json({ success: true, message: 'Client deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteClient = deleteClient;
