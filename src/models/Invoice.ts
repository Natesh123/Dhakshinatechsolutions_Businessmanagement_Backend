import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Client } from './Client';
import { Project } from './Project';
import { Quotation } from './Quotation';

interface InvoiceAttributes {
  id: number;
  invoiceNumber: string;
  clientId: number;
  projectId: number | null;
  quotationId: number | null;
  invoiceDate: Date;
  dueDate: Date | null;
  subTotal: number;
  taxTotal: number;
  discount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  notes: string | null;
  terms: string | null;
  status: string;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'projectId' | 'quotationId' | 'dueDate' | 'subTotal' | 'taxTotal' | 'discount' | 'grandTotal' | 'amountPaid' | 'balanceDue' | 'notes' | 'terms' | 'status'> {}

export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public invoiceNumber!: string;
  public clientId!: number;
  public projectId!: number | null;
  public quotationId!: number | null;
  public invoiceDate!: Date;
  public dueDate!: Date | null;
  public subTotal!: number;
  public taxTotal!: number;
  public discount!: number;
  public grandTotal!: number;
  public amountPaid!: number;
  public balanceDue!: number;
  public notes!: string | null;
  public terms!: string | null;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  invoiceNumber: {
    type: new DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  clientId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: Client, key: 'id' }
  },
  projectId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: { model: Project, key: 'id' }
  },
  quotationId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: { model: Quotation, key: 'id' }
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: { type: DataTypes.DATE, allowNull: true },
  subTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  taxTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  discount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  grandTotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  amountPaid: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  balanceDue: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
  notes: { type: DataTypes.TEXT, allowNull: true },
  terms: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'Unpaid' }, // Unpaid, Partially Paid, Paid, Overdue, Cancelled
}, {
  tableName: 'invoices',
  sequelize,
});

// Relationships
Client.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices' });
Invoice.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Project.hasMany(Invoice, { foreignKey: 'projectId', as: 'invoices' });
Invoice.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Quotation.hasOne(Invoice, { foreignKey: 'quotationId', as: 'invoice' });
Invoice.belongsTo(Quotation, { foreignKey: 'quotationId', as: 'quotation' });
