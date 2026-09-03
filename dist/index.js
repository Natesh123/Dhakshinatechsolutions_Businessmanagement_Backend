"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
dotenv_1.default.config();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const quotationRoutes_1 = __importDefault(require("./routes/quotationRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const staffRoutes_1 = __importDefault(require("./routes/staffRoutes"));
const salaryRoutes_1 = __importDefault(require("./routes/salaryRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/clients', clientRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/quotations', quotationRoutes_1.default);
app.use('/api/invoices', invoiceRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/expenses', expenseRoutes_1.default);
app.use('/api/staff', staffRoutes_1.default);
app.use('/api/salary', salaryRoutes_1.default);
app.use('/api/notes', noteRoutes_1.default);
// Test Route
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is running smoothly.' });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: process.env.NODE_ENV === 'development' ? err : undefined
    });
});
// Start Server
const startServer = async () => {
    await (0, database_1.connectDB)();
    // Sync database models
    // Note: in production, use migrations instead of sync()
    await database_1.sequelize.sync({ alter: true });
    console.log('Database synchronized.');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
startServer();
