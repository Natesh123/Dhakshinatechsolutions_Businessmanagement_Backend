"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Client extends sequelize_1.Model {
}
exports.Client = Client;
Client.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    clientName: {
        type: new sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    companyName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    mobile: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
    alternateMobile: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
    address: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    city: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    state: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    country: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    pincode: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
    gstNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
    panNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: true },
    notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    status: { type: sequelize_1.DataTypes.STRING(20), allowNull: false, defaultValue: 'Active' },
}, {
    tableName: 'clients',
    sequelize: database_1.sequelize,
});
