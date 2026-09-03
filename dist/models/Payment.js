"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Invoice_1 = require("./Invoice");
const Client_1 = require("./Client");
class Payment extends sequelize_1.Model {
}
exports.Payment = Payment;
Payment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    receiptNumber: {
        type: new sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    invoiceId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: Invoice_1.Invoice, key: 'id' }
    },
    clientId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: Client_1.Client, key: 'id' }
    },
    paymentDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    paymentMode: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    referenceNumber: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'payments',
    sequelize: database_1.sequelize,
});
// Relationships
Invoice_1.Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });
Payment.belongsTo(Invoice_1.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
Client_1.Client.hasMany(Payment, { foreignKey: 'clientId', as: 'payments' });
Payment.belongsTo(Client_1.Client, { foreignKey: 'clientId', as: 'client' });
