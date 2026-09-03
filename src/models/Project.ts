import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Client } from './Client';

interface ProjectAttributes {
  id: number;
  clientId: number;
  projectName: string;
  projectDescription: string | null;
  projectType: string | null;
  totalProjectAmount: number;
  startDate: Date | null;
  expectedEndDate: Date | null;
  actualCompletionDate: Date | null;
  status: string;
  notes: string | null;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'projectDescription' | 'projectType' | 'totalProjectAmount' | 'startDate' | 'expectedEndDate' | 'actualCompletionDate' | 'status' | 'notes'> {}

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public clientId!: number;
  public projectName!: string;
  public projectDescription!: string | null;
  public projectType!: string | null;
  public totalProjectAmount!: number;
  public startDate!: Date | null;
  public expectedEndDate!: Date | null;
  public actualCompletionDate!: Date | null;
  public status!: string;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Client,
      key: 'id'
    }
  },
  projectName: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  projectDescription: { type: DataTypes.TEXT, allowNull: true },
  projectType: { type: DataTypes.STRING, allowNull: true },
  totalProjectAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  startDate: { type: DataTypes.DATE, allowNull: true },
  expectedEndDate: { type: DataTypes.DATE, allowNull: true },
  actualCompletionDate: { type: DataTypes.DATE, allowNull: true },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'Draft' },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'projects',
  sequelize,
});

// Relationships
Client.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
Project.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
