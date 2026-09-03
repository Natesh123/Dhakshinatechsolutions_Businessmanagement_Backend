import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Invoice } from './Invoice';

interface InvoiceItemAttributes {
  id: number;
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

interface InvoiceItemCreationAttributes extends Optional<InvoiceItemAttributes, 'id' | 'taxRate' | 'taxAmount' | 'total'> {}

export class InvoiceItem extends Model<InvoiceItemAttributes, InvoiceItemCreationAttributes> implements InvoiceItemAttributes {
  public id!: number;
  public invoiceId!: number;
  public description!: string;
  public quantity!: number;
  public unitPrice!: number;
  public taxRate!: number;
  public taxAmount!: number;
  public total!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InvoiceItem.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  invoiceId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Invoice,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'invoice_items',
  sequelize,
});

// Relationships
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
