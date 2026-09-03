"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Staff extends sequelize_1.Model {
}
exports.Staff = Staff;
Staff.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    designation: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    mobile: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    baseSalary: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    joinDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Active',
    }
}, {
    tableName: 'staff',
    sequelize: database_1.sequelize,
});
