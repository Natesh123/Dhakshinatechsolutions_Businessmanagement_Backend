"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    passwordHash: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    role: {
        type: new sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'admin',
    },
}, {
    tableName: 'users',
    sequelize: database_1.sequelize,
});
