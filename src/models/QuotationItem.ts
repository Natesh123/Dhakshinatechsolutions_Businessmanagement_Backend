import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Quotation } from './Quotation';

interface QuotationItemAttributes {
  id: number;
  quotationId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 18 for 18% GST
  taxAmount: number;
  total: number;
}

interface QuotationItemCreationAttributes extends Optional<QuotationItemAttributes, 'id' | 'taxRate' | 'taxAmount' | 'total'> {}

export class QuotationItem extends Model<QuotationItemAttributes, QuotationItemCreationAttributes> implements QuotationItemAttributes {
  public id!: number;
  public quotationId!: number;
  public description!: string;
  public quantity!: number;
  public unitPrice!: number;
  public taxRate!: number;
  public taxAmount!: number;
  public total!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuotationItem.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  quotationId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Quotation,
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
  tableName: 'quotation_items',
  sequelize,
});

// Relationships
Quotation.hasMany(QuotationItem, { foreignKey: 'quotationId', as: 'items', onDelete: 'CASCADE' });
QuotationItem.belongsTo(Quotation, { foreignKey: 'quotationId', as: 'quotation' });
