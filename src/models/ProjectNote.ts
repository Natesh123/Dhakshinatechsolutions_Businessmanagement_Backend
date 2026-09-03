import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Project } from './Project';

interface ProjectNoteAttributes {
  id: number;
  projectId: number;
  title: string;
  content: string;
}

interface ProjectNoteCreationAttributes extends Optional<ProjectNoteAttributes, 'id'> {}

export class ProjectNote extends Model<ProjectNoteAttributes, ProjectNoteCreationAttributes> implements ProjectNoteAttributes {
  public id!: number;
  public projectId!: number;
  public title!: string;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProjectNote.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Project,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  }
}, {
  tableName: 'project_notes',
  sequelize,
});

// Relationships
Project.hasMany(ProjectNote, { foreignKey: 'projectId', as: 'notesList' });
ProjectNote.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
