import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ExpenseAttributes {
  id: number;
  category: string; // e.g., Office Supplies, Rent, Internet, Software, Travel
  description: string;
  amount: number;
  expenseDate: Date;
  paymentMode: string;
  referenceNumber: string | null;
  notes: string | null;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id' | 'referenceNumber' | 'notes'> {}

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
  public id!: number;
  public category!: string;
  public description!: string;
  public amount!: number;
  public expenseDate!: Date;
  public paymentMode!: string;
  public referenceNumber!: string | null;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Expense.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  expenseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  paymentMode: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  referenceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'expenses',
  sequelize,
});
