"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectNote = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Project_1 = require("./Project");
class ProjectNote extends sequelize_1.Model {
}
exports.ProjectNote = ProjectNote;
ProjectNote.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    projectId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Project_1.Project,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'project_notes',
    sequelize: database_1.sequelize,
});
// Relationships
Project_1.Project.hasMany(ProjectNote, { foreignKey: 'projectId', as: 'notesList' });
ProjectNote.belongsTo(Project_1.Project, { foreignKey: 'projectId', as: 'project' });
