"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryPayment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Staff_1 = require("./Staff");
class SalaryPayment extends sequelize_1.Model {
}
exports.SalaryPayment = SalaryPayment;
SalaryPayment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    staffId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: Staff_1.Staff, key: 'id' }
    },
    month: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    paymentDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    baseSalary: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    bonus: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    deductions: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    netSalary: {
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
    tableName: 'salary_payments',
    sequelize: database_1.sequelize,
});
// Relationships
Staff_1.Staff.hasMany(SalaryPayment, { foreignKey: 'staffId', as: 'salaryPayments' });
SalaryPayment.belongsTo(Staff_1.Staff, { foreignKey: 'staffId', as: 'staff' });
