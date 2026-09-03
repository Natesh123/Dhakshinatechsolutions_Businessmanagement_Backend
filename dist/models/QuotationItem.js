"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationItem = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Quotation_1 = require("./Quotation");
class QuotationItem extends sequelize_1.Model {
}
exports.QuotationItem = QuotationItem;
QuotationItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    quotationId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Quotation_1.Quotation,
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
    tableName: 'quotation_items',
    sequelize: database_1.sequelize,
});
// Relationships
Quotation_1.Quotation.hasMany(QuotationItem, { foreignKey: 'quotationId', as: 'items', onDelete: 'CASCADE' });
QuotationItem.belongsTo(Quotation_1.Quotation, { foreignKey: 'quotationId', as: 'quotation' });
