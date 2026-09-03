import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Staff } from './Staff';

interface SalaryPaymentAttributes {
  id: number;
  staffId: number;
  month: string; // e.g., "August 2026"
  paymentDate: Date;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  paymentMode: string;
  referenceNumber: string | null;
  notes: string | null;
}

interface SalaryPaymentCreationAttributes extends Optional<SalaryPaymentAttributes, 'id' | 'bonus' | 'deductions' | 'referenceNumber' | 'notes'> {}

export class SalaryPayment extends Model<SalaryPaymentAttributes, SalaryPaymentCreationAttributes> implements SalaryPaymentAttributes {
  public id!: number;
  public staffId!: number;
  public month!: string;
  public paymentDate!: Date;
  public baseSalary!: number;
  public bonus!: number;
  public deductions!: number;
  public netSalary!: number;
  public paymentMode!: string;
  public referenceNumber!: string | null;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SalaryPayment.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  staffId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: Staff, key: 'id' }
  },
  month: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  baseSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  bonus: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  deductions: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  netSalary: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
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
  tableName: 'salary_payments',
  sequelize,
});

// Relationships
Staff.hasMany(SalaryPayment, { foreignKey: 'staffId', as: 'salaryPayments' });
SalaryPayment.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });
