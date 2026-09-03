import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Client } from './Client';
import { Project } from './Project';

interface QuotationAttributes {
  id: number;
  quotationNumber: string;
  clientId: number;
  projectId: number | null;
  quotationDate: Date;
  validUntil: Date | null;
  subTotal: number;
  taxTotal: number;
  discount: number;
  grandTotal: number;
  notes: string | null;
  terms: string | null;
  status: string;
}

interface QuotationCreationAttributes extends Optional<QuotationAttributes, 'id' | 'projectId' | 'validUntil' | 'subTotal' | 'taxTotal' | 'discount' | 'grandTotal' | 'notes' | 'terms' | 'status'> {}

export class Quotation extends Model<QuotationAttributes, QuotationCreationAttributes> implements QuotationAttributes {
  public id!: number;
  public quotationNumber!: string;
  public clientId!: number;
  public projectId!: number | null;
  public quotationDate!: Date;
  public validUntil!: Date | null;
  public subTotal!: number;
  public taxTotal!: number;
  public discount!: number;
  public grandTotal!: number;
  public notes!: string | null;
  public terms!: string | null;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Quotation.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  quotationNumber: {
    type: new DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  clientId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Client,
      key: 'id'
    }
  },
  projectId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: Project,
      key: 'id'
    }
  },
  quotationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  validUntil: { type: DataTypes.DATE, allowNull: true },
  subTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  taxTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  discount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  grandTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  notes: { type: DataTypes.TEXT, allowNull: true },
  terms: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'Draft' },
}, {
  tableName: 'quotations',
  sequelize,
});

// Relationships
Client.hasMany(Quotation, { foreignKey: 'clientId', as: 'quotations' });
Quotation.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Project.hasMany(Quotation, { foreignKey: 'projectId', as: 'quotations' });
Quotation.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
