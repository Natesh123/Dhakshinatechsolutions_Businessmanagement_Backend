"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Client_1 = require("./Client");
const Project_1 = require("./Project");
const Quotation_1 = require("./Quotation");
class Invoice extends sequelize_1.Model {
}
exports.Invoice = Invoice;
Invoice.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    invoiceNumber: {
        type: new sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    clientId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: Client_1.Client, key: 'id' }
    },
    projectId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: Project_1.Project, key: 'id' }
    },
    quotationId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: Quotation_1.Quotation, key: 'id' }
    },
    invoiceDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    dueDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    subTotal: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    taxTotal: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    discount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    grandTotal: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    amountPaid: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    balanceDue: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    terms: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    status: { type: sequelize_1.DataTypes.STRING(20), allowNull: false, defaultValue: 'Unpaid' }, // Unpaid, Partially Paid, Paid, Overdue, Cancelled
}, {
    tableName: 'invoices',
    sequelize: database_1.sequelize,
});
// Relationships
Client_1.Client.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices' });
Invoice.belongsTo(Client_1.Client, { foreignKey: 'clientId', as: 'client' });
Project_1.Project.hasMany(Invoice, { foreignKey: 'projectId', as: 'invoices' });
Invoice.belongsTo(Project_1.Project, { foreignKey: 'projectId', as: 'project' });
Quotation_1.Quotation.hasOne(Invoice, { foreignKey: 'quotationId', as: 'invoice' });
Invoice.belongsTo(Quotation_1.Quotation, { foreignKey: 'quotationId', as: 'quotation' });
