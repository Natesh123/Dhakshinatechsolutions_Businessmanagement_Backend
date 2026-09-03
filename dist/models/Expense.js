"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Expense extends sequelize_1.Model {
}
exports.Expense = Expense;
Expense.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    expenseDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
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
    tableName: 'expenses',
    sequelize: database_1.sequelize,
});
