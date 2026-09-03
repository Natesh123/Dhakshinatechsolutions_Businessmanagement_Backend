"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getStaffById = exports.getStaff = void 0;
const Staff_1 = require("../models/Staff");
const getStaff = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.findAll({
            order: [['name', 'ASC']]
        });
        res.json({ success: true, data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getStaff = getStaff;
const getStaffById = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.findByPk(req.params.id);
        if (!staff) {
            res.status(404).json({ success: false, message: 'Staff not found' });
            return;
        }
        res.json({ success: true, data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.getStaffById = getStaffById;
const createStaff = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.create(req.body);
        res.status(201).json({ success: true, message: 'Staff created successfully', data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.createStaff = createStaff;
const updateStaff = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.findByPk(req.params.id);
        if (!staff) {
            res.status(404).json({ success: false, message: 'Staff not found' });
            return;
        }
        await staff.update(req.body);
        res.json({ success: true, message: 'Staff updated successfully', data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.updateStaff = updateStaff;
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.findByPk(req.params.id);
        if (!staff) {
            res.status(404).json({ success: false, message: 'Staff not found' });
            return;
        }
        await staff.destroy();
        res.json({ success: true, message: 'Staff deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.deleteStaff = deleteStaff;
