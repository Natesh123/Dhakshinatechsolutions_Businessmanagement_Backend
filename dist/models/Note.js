"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Note extends sequelize_1.Model {
}
exports.Note = Note;
Note.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    relatedTo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    tableName: 'notes',
    sequelize: database_1.sequelize,
});
