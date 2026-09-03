"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanySetting = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class CompanySetting extends sequelize_1.Model {
}
exports.CompanySetting = CompanySetting;
CompanySetting.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    companyName: {
        type: new sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    logo: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    address: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    city: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    state: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    country: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    pincode: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
    mobile: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
    email: { type: sequelize_1.DataTypes.STRING(100), allowNull: true },
    website: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    gstNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
    panNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
    bankName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    accountHolderName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    accountNumber: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ifsc: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
    upiId: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    authorizedPersonName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    signature: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    documentPrefix: { type: new sequelize_1.DataTypes.STRING(10), allowNull: false, defaultValue: 'DTS' }
}, {
    tableName: 'company_settings',
    sequelize: database_1.sequelize,
});
