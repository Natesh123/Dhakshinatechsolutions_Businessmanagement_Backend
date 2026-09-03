"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: { id: user.id, email: user.email, role: user.role }
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.login = login;
const registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await User_1.User.findOne({ where: { email } });
        if (existing) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.User.create({
            email,
            passwordHash,
            role: 'admin'
        });
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: { id: user.id, email: user.email }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', errors: [error] });
    }
};
exports.registerAdmin = registerAdmin;
