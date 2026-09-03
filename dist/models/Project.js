"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Client_1 = require("./Client");
class Project extends sequelize_1.Model {
}
exports.Project = Project;
Project.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    clientId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Client_1.Client,
            key: 'id'
        }
    },
    projectName: {
        type: new sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    projectDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    projectType: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    totalProjectAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    startDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    expectedEndDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    actualCompletionDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    status: { type: sequelize_1.DataTypes.STRING(20), allowNull: false, defaultValue: 'Draft' },
    notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'projects',
    sequelize: database_1.sequelize,
});
// Relationships
Client_1.Client.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
Project.belongsTo(Client_1.Client, { foreignKey: 'clientId', as: 'client' });
