"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItem = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Invoice_1 = require("./Invoice");
class InvoiceItem extends sequelize_1.Model {
}
exports.InvoiceItem = InvoiceItem;
InvoiceItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    invoiceId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Invoice_1.Invoice,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    quantity: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1
    },
    unitPrice: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    taxRate: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
    },
    taxAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
    },
    total: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'invoice_items',
    sequelize: database_1.sequelize,
});
// Relationships
Invoice_1.Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice_1.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
